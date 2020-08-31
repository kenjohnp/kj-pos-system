import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../common/pageTitle";
import {
  renderInput,
  renderButton,
  renderIconButton,
} from "../common/renderForms";
import Select from "../common/select";
import TransactionItems from "./transactionItems";
import { loadProducts } from "../../store/products";
import { transactionErrorsSet, clearErrors } from "../../store/transactions";
import M from "materialize-css";

const Transaction = () => {
  const dispatch = useDispatch();

  const { list: products } = useSelector((state) => state.entities.products);
  const { errors } = useSelector((state) => state.entities.transactions);

  const productsOptions = products.map((p) => ({
    label: p.description,
    value: p.barcode,
  }));

  const [transaction, setTransaction] = useState({
    no: "202040294452",
    date: new Date().toDateString(),
    items: [],
  });

  const [barcode, setBarcode] = useState("");

  const [selectedProduct, setSelectedProduct] = useState({});

  const [amountSummary, setAmountSummary] = useState({
    vat: { label: "VAT", value: 0 },
    subTotal: { label: "Sub-Total", value: 0 },
    total: { label: "Total Sales", value: 0 },
  });

  useEffect(() => {
    dispatch(loadProducts());
    return () => dispatch(clearErrors());
  }, []);

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
    computeTotalAmount();
  };

  const handleChangeItem = (path, index, value) => {
    const newTransaction = { ...transaction };
    newTransaction.items[index][path] = value;

    setTransaction(newTransaction);
    computeTotalAmount();
  };

  const computeTotalAmount = () => {
    const totalAmount = transaction.items.reduce(
      (a, b) => a + b.qty * (b.price - b.discount),
      0
    );

    const newAmountSummary = { ...amountSummary };
    newAmountSummary.total.value = totalAmount;
    newAmountSummary.vat.value = totalAmount * 0.12;
    newAmountSummary.subTotal.value =
      newAmountSummary.total.value - newAmountSummary.vat.value;

    setAmountSummary(newAmountSummary);
  };

  const handleSave = () => {};

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
            defaultValue: transaction.no,
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
                onChange={handleChangeItem}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s4">
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Payments Received (Cash)</b>
                  </td>
                  <td>
                    <input style={{ textAlign: "right" }}></input>
                  </td>
                </tr>
                <tr
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "green",
                  }}
                >
                  <td>Change</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col s4"></div>
          <div className="col s4">
            <table>
              <tbody>
                {Object.entries(amountSummary).map((i) => (
                  <tr
                    key={i[1].label}
                    style={
                      i[0] === "total"
                        ? {
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "green",
                          }
                        : {}
                    }
                  >
                    <td>
                      <b>{i[1].label}</b>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {"PHP " + i[1].value.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {renderIconButton("New", handleSave, "add", "large", "blue")}
        {renderIconButton("Cancel", handleSave, "cancel", "large", "red")}
        {renderIconButton(
          "Print Receipt",
          handleSave,
          "print",
          "large",
          "teal"
        )}
        {renderIconButton("History", handleSave, "save", "large", "grey")}
        {renderIconButton("Finish", handleSave, "save", "large", "green")}
      </div>
    </>
  );
};

export default Transaction;
