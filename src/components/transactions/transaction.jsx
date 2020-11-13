import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import validate from "../../utils/validate";
import PageTitle from "../common/pageTitle";
import { renderInput, renderButton, renderIconButton } from "../common/renderForms";
import Select from "../common/select";
import Loader from "../common/loader";
import TransactionItems from "./transactionItems";
import { loadProducts, stockDecremented } from "../../store/products";
import { transactionErrorsSet, generateTransactionId, addTransaction, successClosed, errorsCleared, getTransaction } from "../../store/transactions";
import Summary from "./summary";
import Payment from "./payment";

const Transaction = ({ match }) => {
  const dispatch = useDispatch();

  const initialValues = {
    date: new Date(),
    items: [],
    cashReceived: "",
    amountSummary: {
      discount: { label: "Total Discount", value: 0 },
      vat: { label: "VAT", value: 0 },
      subTotal: { label: "Sub-Total", value: 0 },
      total: { label: "Total Sales", value: 0 },
    },
  };

  const { list: products, loading: productsLoading } = useSelector((state) => state.entities.products);
  const { currentNo, errors, loading, success, selectedTransaction } = useSelector((state) => state.entities.transactions);

  const productsOptions = products.map((p) => ({
    label: p.description,
    value: p._id,
  }));

  const [transaction, setTransaction] = useState(initialValues);

  const [barcode, setBarcode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({});
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    initializeValues();

    if (!_.isEmpty(match.params)) {
      dispatch(getTransaction(match.params.id));
      setReadOnly(true);
    } else {
      dispatch(loadProducts());
    }
    return () => dispatch(errorsCleared());
  }, [dispatch, match.params]);

  useEffect(() => {
    if (!_.isEmpty(selectedTransaction) && match.params.id) {
      const newTransaction = { ...selectedTransaction };
      newTransaction.date = new Date(selectedTransaction.date);

      setTransaction(newTransaction);
    }
  }, [selectedTransaction, match.params.id]);

  const schema = {
    date: Joi.date().required().label("Date"),
    items: Joi.array()
      .items(
        Joi.object({
          barcode: Joi.string().allow("").label("Barcode"),
          itemName: Joi.string().required().label("Item Name"),
          productId: Joi.string().required().label("Product ID"),
          price: Joi.number().min(1).required().label("Price"),
          qty: Joi.number().min(1).required().label("Qty"),
          discount: Joi.number().min(0).required().label("Discount"),
        })
      )
      .min(1)
      .label("Product"),
    cashReceived: Joi.number().min(0).required().label("Cash Received"),
  };

  const initializeValues = () => {
    dispatch(generateTransactionId());
    setTransaction(initialValues);
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

  const validateProduct = (item) => {
    const product = products.find((p) => p.barcode === item.barcode || p._id === item.productId);

    if (!product) return setBarcodeErrors("Barcode/Product not found in the database.");

    if (product.inStock <= 0) return setBarcodeErrors("Out of stock.");

    return product;
  };

  const addToItems = (item) => {
    const product = validateProduct({
      barcode: item.barcode,
      productId: item.productId,
    });

    if (product) addProduct(item, product);
  };

  const addProduct = (item, product) => {
    const { description, price, barcode } = product;

    const newTransaction = { ...transaction };

    const existingProduct = getExistingProduct({
      barcode: item.barcode,
      productId: item.productId,
    });

    if (existingProduct) {
      if (product.inStock <= existingProduct.qty) return setBarcodeErrors("Out of stock.");

      newTransaction.items[existingProduct.index].qty += 1;

      setTransaction(newTransaction);
    } else {
      newTransaction.items.push({
        index: transaction.items.length,
        barcode: barcode,
        productId: product._id,
        itemName: description,
        price,
        qty: 1,
        currentQty: product.inStock,
        discount: "",
      });
      setTransaction(newTransaction);
    }

    dispatch(errorsCleared());
  };

  const getExistingProduct = (product) => {
    return transaction.items.find((i) => i.barcode === product.barcode || i.productId === product.productId);
  };

  const handleAddProduct = () => {
    addToItems({ productId: selectedProduct.value });
    computeSummary();
    setSelectedProduct({});
  };

  const getTotalAmount = () =>
    transaction.items.reduce((a, b) => {
      return a + (b.qty || 0) * (b.price - (parseFloat(b.discount.replace(/[^\d.-]/g, "")) || 0));
    }, 0);

  const getTotalDiscount = () => transaction.items.reduce((a, b) => a + (parseFloat(b.discount.replace(/[^\d.-]/g, "")) || 0), 0);

  const handleSubmitBarcode = ({ currentTarget: input, key }) => {
    if (key === "Enter") {
      addToItems({ barcode: input.value });
      computeSummary();
      setBarcode("");
    }
  };

  const handleChangeQty = (index, value, currentQty) => {
    const newTransaction = { ...transaction };

    if (value < 0 || value > currentQty) return toast.error("Qty must not exceed current stock");

    newTransaction.items[index].qty = typeof value === "string" ? parseInt(value) : value;

    computeSummary();
    setTransaction(newTransaction);
  };

  const handleChangeDiscount = ({ currentTarget: input }, item) => {
    const newTransaction = { ...transaction };

    let discount = input.value.replace(/[^\d.-]/g, "");

    if (item.price < discount) {
      toast.error("Discount must be not greater than the Price.");
      discount = "";
    }

    newTransaction.items[item.index].discount = discount;
    computeSummary();
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

    const newTransaction = { ...transaction };

    const { total, vat, subTotal, discount } = newTransaction.amountSummary;

    discount.value = totalDiscount;
    total.value = totalAmount;
    vat.value = totalAmount * 0.12;
    subTotal.value = total.value - vat.value;

    setTransaction(newTransaction);
  };

  const handleChangeCashReceived = ({ currentTarget: input }) => {
    const newTransaction = { ...transaction };
    newTransaction.cashReceived = input.value;
    setTransaction(newTransaction);
  };

  const resetIndex = () => {
    const newTransaction = { ...transaction };

    for (let i = 0; i < newTransaction.items.length; i++) newTransaction.items[i].index = i;

    setTransaction(newTransaction);
  };

  const totalAmount = getTotalAmount();

  const handleSubmit = async () => {
    const transactionItems = transaction.items.map((i) => ({
      barcode: i.barcode,
      productId: i.productId,
      itemName: i.itemName,
      price: i.price,
      qty: i.qty,
      discount: parseFloat(i.discount) || 0,
    }));

    const cashReceived = parseFloat(transaction.cashReceived.replace(/[^\d.-]/g, ""));

    const payload = {
      date: transaction.date.toString(),
      cashReceived,
      items: transactionItems,
    };

    let formErrors = validate(payload, schema) || {};

    if (cashReceived < totalAmount) formErrors.cashReceived = "Insufficient Amount";

    dispatch(transactionErrorsSet({ errors: formErrors || {} }));

    if (Object.keys(formErrors).length !== 0) return;

    await dispatch(addTransaction(payload));
    await dispatch(stockDecremented({ items: transactionItems }));

    initializeValues();
  };

  const handleClickNew = () => {
    initializeValues();
  };

  const buttonGroup = [
    {
      label: "New",
      icon: "add",
      color: "blue",
      onClick: handleClickNew,
      link: "/transaction",
    },
    {
      label: "Cancel",
      icon: "cancel",
      color: "red",
      onClick: handleClickNew,
    },
    {
      label: "Print Receipt",
      icon: "print",
      color: "teal",
      onClick: handleClickNew,
    },
    {
      label: "History",
      icon: "save",
      color: "grey",
      link: "/transactionsHistory",
    },
    {
      label: "Finish",
      icon: "save",
      color: "green",
      onClick: handleSubmit,
    },
  ];

  return (
    <>
      <PageTitle title="Transaction" />
      {errors.apiError.message && <div className="statusBox red white-text center">{errors.apiError.message}</div>}
      {success && (
        <div className="statusBox green white-text center">
          Transaction Completed. Print receipt <Link to="#">here</Link>
          <span className="badge white-text" style={{ cursor: "pointer" }} onClick={() => dispatch(successClosed())}>
            <i className="material-icons">close</i>
          </span>
        </div>
      )}
      <Loader className="left-align" loading={loading || productsLoading} />
      <div className="row">
        <div className="col s12">
          <div className="row">
            {renderInput({
              name: "transactionNo",
              label: "Transaction No.",
              customClass: "col s4",
              disableRow: true,
              value: transaction.transactionNo || currentNo || "",
              readOnly: true,
            })}
            <div className="col s6"></div>
            {renderInput({
              name: "date",
              label: "Transaction Date.",
              customClass: "col s2",
              disableRow: true,
              defaultValue: transaction.date.toDateString(),
              readOnly: true,
            })}
          </div>

          <div className="row">
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
                <div className="col" style={{ display: "flex", alignItems: "flex-end" }}>
                  {renderButton("Add", (e) => handleAddProduct(e))}
                </div>
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
              {errors.formErrors.items && <div className="statusBox red white-text center">{errors.formErrors.items}</div>}
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
            <Summary data={transaction.amountSummary} />
          </div>
        </div>
        {buttonGroup.map((b) => renderIconButton(b.label, b.onClick, b.icon, b.size, b.color, b.link))}
      </div>
    </>
  );
};

export default Transaction;
