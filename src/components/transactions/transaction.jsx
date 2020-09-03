import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import validate from "../../utils/validate";
import PageTitle from "../common/pageTitle";
import {
  renderInput,
  renderButton,
  renderIconButton,
} from "../common/renderForms";
import Select from "../common/select";
import TransactionItems from "./transactionItems";
import { loadProducts } from "../../store/products";
import {
  transactionErrorsSet,
  clearErrors,
  generateTransactionId,
} from "../../store/transactions";
import Summary from "./summary";
import Payment from "./payment";

const Transaction = () => {
  const dispatch = useDispatch();

  const { list: products } = useSelector((state) => state.entities.products);
  const { currentNo, errors } = useSelector(
    (state) => state.entities.transactions
  );

  const productsOptions = products.map((p) => ({
    label: p.description,
    value: p.barcode,
  }));

  const [transaction, setTransaction] = useState({
    date: new Date().toDateString(),
    items: [],
    cashReceived: 0,
  });

  const [barcode, setBarcode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({});
  const [amountSummary, setAmountSummary] = useState({
    discount: { label: "Total Discount", value: 0 },
    vat: { label: "VAT", value: 0 },
    subTotal: { label: "Sub-Total", value: 0 },
    total: { label: "Total Sales", value: 0 },
  });

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(generateTransactionId());
    return () => dispatch(clearErrors());
  }, []);

  useEffect(() => {
    computeSummary();
  }, [transaction]);

  const schema = {
    date: Joi.date().required().label("Date"),
    items: Joi.array()
      .items(
        Joi.object({
          barcode: Joi.string().allow("").label("Barcode"),
          itemName: Joi.string().required().label("Item Name"),
          price: Joi.number().min(1).required().label("Price"),
          qty: Joi.number().min(1).required().label("Qty"),
          discount: Joi.number().min(0).required().label("Discount"),
        })
      )
      .min(1)
      .label("Items"),
  };

  const handleChangeBarcode = (e) => {
    setBarcode(e.currentTarget.value);
  };

  const setBarcodeErrors = (error) => {
    dispatch(
      transactionErrorsSet({
        errors:
          {
            barcode: error,
          } || {},
      })
    );
    setBarcode("");
  };

  const validateBarcode = (barcode) => {
    const product = products.find((p) => p.barcode === barcode);

    if (!product)
      return setBarcodeErrors("Barcode/Product not found in the database.");

    if (product.inStock <= 0) return setBarcodeErrors("Out of stock.");

    return product;
  };

  const getExistingProduct = (barcode) => {
    return transaction.items.find((i) => i.barcode === barcode);
  };

  const getTotalAmount = () =>
    transaction.items.reduce(
      (a, b) => a + (b.qty || 0) * (b.price - (parseFloat(b.discount) || 0)),
      0
    );

  const getTotalDiscount = () =>
    transaction.items.reduce((a, b) => a + (parseFloat(b.discount) || 0), 0);

  const addProduct = (barcode, product) => {
    const { description, price } = product;

    const newTransaction = { ...transaction };

    const existingProduct = getExistingProduct(barcode);

    if (existingProduct) {
      if (product.inStock <= existingProduct.qty)
        return setBarcodeErrors("Out of stock.");

      newTransaction.items[existingProduct.index].qty += 1;
      setTransaction(newTransaction);
    } else {
      newTransaction.items.push({
        index: transaction.items.length,
        barcode,
        itemName: description,
        price,
        qty: 1,
        discount: 0,
      });
      setTransaction(newTransaction);
    }

    dispatch(clearErrors());
  };

  const handleSubmitBarcode = ({ currentTarget: input, key }) => {
    if (key === "Enter") {
      addToItems(input.value);

      setBarcode("");
    }
  };

  const addToItems = (value) => {
    const product = validateBarcode(value);

    if (product) addProduct(value, product);
  };

  const handleAddProduct = () => {
    addToItems(selectedProduct.value);
    setSelectedProduct({});
  };

  const handleChangeQty = (index, value) => {
    const newTransaction = { ...transaction };

    if (value < 0) return;
    newTransaction.items[index].qty = value;

    setTransaction(newTransaction);
  };

  const handleChangeDiscount = (value, name, index) => {
    const newTransaction = { ...transaction };
    newTransaction.items[index][name] = value;
    setTransaction(newTransaction);
  };

  const handleRemoveItem = (index) => {
    const newTransaction = { ...transaction };
    newTransaction.items.splice(index, 1);

    setTransaction(newTransaction);
    resetIndex();
  };

  const computeSummary = () => {
    const totalAmount = getTotalAmount();
    const totalDiscount = getTotalDiscount();

    const newAmountSummary = { ...amountSummary };

    const { total, vat, subTotal, discount } = newAmountSummary;

    discount.value = totalDiscount;
    total.value = totalAmount;
    vat.value = totalAmount * 0.12;
    subTotal.value = total.value - vat.value;

    setAmountSummary(newAmountSummary);
  };

  const handleChangeCashReceived = (value) => {
    const newTransaction = { ...transaction };
    newTransaction.cashReceived = value;
    setTransaction(newTransaction);
  };

  const totalAmount = getTotalAmount();

  const resetIndex = () => {
    const newTransaction = { ...transaction };

    for (let i = 0; i < newTransaction.items.length; i++)
      newTransaction.items[i].index = i;

    setTransaction(newTransaction);
  };

  const handleSubmit = () => {
    const payload = {
      date: transaction.date,
      cashReceived: transaction.cashReceived,
      items: transaction.items,
    };

    let formErrors = validate(payload, schema) || {};

    if (transaction.cashReceived < totalAmount)
      formErrors.cashReceived = "Enter the right amount";

    if (formErrors) console.log(formErrors);

    dispatch(transactionErrorsSet({ errors: formErrors || {} }));
  };

  return (
    <>
      <PageTitle title="Transaction" />
      <div className="row">
        <div className="col s12">
          {renderInput({
            name: "transactionNo",
            label: "Transaction No.",
            customClass: "col s4",
            disableRow: true,
            value: currentNo || "",
            readOnly: true,
          })}
          <div className="col s6"></div>
          {renderInput({
            name: "date",
            label: "Transaction Date.",
            customClass: "col s2",
            disableRow: true,
            defaultValue: transaction.date,
            readOnly: true,
          })}
          {renderInput({
            name: "barcode",
            label: "Barcode",
            placeholder: "Scan Barcode Here...",
            customClass: "col s4",
            disableRow: true,
            data: barcode,
            error: errors.formErrors["barcode"],
            autoComplete: "off",
            onChange: handleChangeBarcode,
            onKeyDown: handleSubmitBarcode,
          })}
          <div className="col s3"></div>
          <div className="col s5">
            <div className="row" style={{ display: "flex" }}>
              <div className="col s8">
                <Select
                  options={productsOptions}
                  placeHolder="Select item"
                  label="Manual Add"
                  wrappedInRow={false}
                  value={selectedProduct}
                  onChange={(selectedItem) => setSelectedProduct(selectedItem)}
                  error={errors.formErrors["barcode"]}
                  tableItem
                />
              </div>
              <div
                className="col"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                {renderButton("Add", (e) => handleAddProduct(e))}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s12" style={{ minHeight: "300px" }}>
              <TransactionItems
                items={transaction.items}
                onChange={handleChangeQty}
                onDelete={handleRemoveItem}
                onChangeDiscount={handleChangeDiscount}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s4">
            <Payment
              received={transaction.cashReceived}
              totalAmount={totalAmount}
              onChange={handleChangeCashReceived}
              error={errors.formErrors["cashReceived"]}
            />
          </div>
          <div className="col s4"></div>
          <div className="col s4">
            <Summary data={amountSummary} />
          </div>
        </div>
        {renderIconButton("New", handleSubmit, "add", "large", "blue")}
        {renderIconButton("Cancel", handleSubmit, "cancel", "large", "red")}
        {renderIconButton(
          "Print Receipt",
          handleSubmit,
          "print",
          "large",
          "teal"
        )}
        {renderIconButton("History", handleSubmit, "save", "large", "grey")}
        {renderIconButton("Finish", handleSubmit, "save", "large", "green")}
      </div>
    </>
  );
};

export default Transaction;
