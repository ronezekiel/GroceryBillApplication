import React, { Component } from 'react';
import { Modal, Button, Dropdown } from "react-bootstrap";
import ItemService from '../../services/ItemService';
import { withRouter } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import jsPDF from "jspdf";
import 'jspdf-autotable'


class ItemComponent extends Component {
    constructor(props) {
        super(props)


        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        let decrypted = "";
        var CryptoJS = require("crypto-js");
        if (localStorage.getItem("username") === null) {
            this.props.history.push("/");
        } else {
            var user = JSON.parse(localStorage.getItem('username'));
            var bytes = CryptoJS.AES.decrypt(user, 'my-secret-key@123');
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            decrypted = decryptedData;
        }

        this.state = {
            items: [],
            itemsRegular: [],
            itemsDiscounted: [],
            itemsView: [],
            username: decrypted,
            id: '',
            name: '',
            price: 0.0,
            discounted: "",
            discountPercentage: 0.0,
            actualPrice: 0.0,
            madeBy: "",
            createdOn: "",
            isOpen: false,
            isOpenUpdate: false,
            isOpenPrint: false,
            isOpenView: false,
            isPriceDiscounted: false,
            isDisplayShow: "none",
            itemId: '',
            currentDate: date,
            selectedList: "all",
            totalBill: 0,
            totalRegularBill: 0,
            totalDiscountedBill: 0,
            filterStr: ""
        }

        this.onClickAll = this.onClickAll.bind(this);
        this.onClickRegular = this.onClickRegular.bind(this);
        this.onClickDiscounted = this.onClickDiscounted.bind(this);

        this.viewItem = this.viewItem.bind(this);
        
        this.searchBoxFilter = this.searchBoxFilter.bind(this);

        this.saveButton = this.saveButton.bind(this);
        this.addOrUpdateProduct = this.addOrUpdateProduct.bind(this);
        this.updateDialog = this.updateDialog.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeValueYes = this.onChangeValueYes.bind(this);
        this.onChangeValueNo = this.onChangeValueNo.bind(this);
        this.onChangeDiscountPercentage = this.onChangeDiscountPercentage.bind(this);
    }

    searchBoxFilter = (e) => { this.setState({ filterStr: e.target.value }) };

    onClickAll = (e) => { this.setState({ selectedList: "all" }) };
    onClickRegular = (e) => { this.setState({ selectedList: "regular" }) };
    onClickDiscounted = (e) => { this.setState({ selectedList: "discounted" }) };


    onChangeName = (e) => { this.setState({ name: e.target.value }) };
    onChangePrice = (e) => {
        var priceValue = e.target.value;
        var percentValue = this.state.discountPercentage;
        const perc = (percentValue * priceValue) / 100;
        const result = priceValue - perc;
        var priceDouble = parseFloat(e.target.value);
        var actualDouble = this.roundToTwo(result);
        this.setState({ price: priceDouble, actualPrice: actualDouble })
    };
    onChangeDiscountPercentage = (e) => {
        if (e.target.value <= 100) {
            var priceValue = this.state.price;
            var percentValue = e.target.value;
            const perc = (percentValue * priceValue) / 100;
            const result = priceValue - perc;
            var discountDouble = parseFloat(e.target.value);
            var actualDouble = this.roundToTwo(result);
            this.setState({
                discountPercentage: discountDouble,
                actualPrice: actualDouble
            });
        } else {
            e.target.value = "";
        }

    };

    onChangeValueYes(event) {
        this.setState({
            isPriceDiscounted: true,
            isDisplayShow: "block"
        });
    }
    onChangeValueNo(event) {
        this.setState({
            isPriceDiscounted: false,
            isDisplayShow: "none"
        });
    }

    openModal = () => this.setState({
        isOpen: true,
        isOpenUpdate: false,
        id: "",
        name: "",
        price: 0.0,
        discounted: "",
        discountPercentage: 0.0,
        actualPrice: 0.0,
        isPriceDiscounted: false,
        isDisplayShow: "none"

    });
    closeModal = () => this.setState({ isOpen: false });

    viewItem = (id) => {
        ItemService.getItemById(id).then(response => {
            if (response.data.discounted) {
                this.setState({
                    isPriceDiscounted: true,
                    isDisplayShow: "block"
                });
            } else {
                this.setState({
                    isPriceDiscounted: false,
                    isDisplayShow: "none"
                });
            }
            this.setState({
                isOpenView: true,
                id: response.data.id,
                name: response.data.name,
                price: response.data.price,
                discountPercentage: response.data.discountPercentage,
                actualPrice: response.data.actualPrice,
                createdOn: response.data.createdOn
            });
        });
    }
    closeModalView = () => this.setState({ isOpenView: false });

    closeModalPrint = () => this.setState({ isOpenPrint: false });
    openModalPrint = () => this.setState({ isOpenPrint: true });

    componentDidMount(props) {

        if (this.state.username == "") {

        } else {
            ItemService.getItemList().then((res) => {
                var itemsArr = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].madeBy == this.state.username) {
                        if (res.data[i].discounted) {
                            itemsArr.push({
                                id: res.data[i].id,
                                name: res.data[i].name,
                                price: res.data[i].price,
                                discounted: "true",
                                discountPercentage: res.data[i].discountPercentage,
                                actualPrice: res.data[i].actualPrice
                            });
                        } else {
                            itemsArr.push({
                                id: res.data[i].id,
                                name: res.data[i].name,
                                price: res.data[i].price,
                                discounted: "false",
                                discountPercentage: res.data[i].discountPercentage,
                                actualPrice: res.data[i].actualPrice
                            });
                        }
                    }
                }
                this.setState({ items: itemsArr });
            });
            ItemService.getRegularItemList().then((res) => {
                var itemsArr = [];
                for (let i = 0; i < res.data.itemList.length; i++) {
                    if (res.data.itemList[i].madeBy == this.state.username) {
                        itemsArr.push({
                            id: res.data.itemList[i].id,
                            name: res.data.itemList[i].name,
                            price: res.data.itemList[i].price,
                            discounted: "false",
                            discountPercentage: res.data.itemList[i].discountPercentage,
                            actualPrice: res.data.itemList[i].actualPrice
                        });
                    }
                }
                this.setState({ itemsRegular: itemsArr });
            });
            ItemService.getDiscountedItemList().then((res) => {
                var itemsArr = [];
                for (let i = 0; i < res.data.itemList.length; i++) {
                    if (res.data.itemList[i].madeBy == this.state.username) {
                        itemsArr.push({
                            id: res.data.itemList[i].id,
                            name: res.data.itemList[i].name,
                            price: res.data.itemList[i].price,
                            discounted: "true",
                            discountPercentage: res.data.itemList[i].discountPercentage,
                            actualPrice: res.data.itemList[i].actualPrice
                        });
                    }
                }
                this.setState({ itemsDiscounted: itemsArr });
            });
            ItemService.getTotalBill(this.state.username).then((res) => {
                this.setState({ totalBill: res.data });
            });
            ItemService.getRegularBill(this.state.username).then((res) => {
                this.setState({ totalRegularBill: res.data });
            });
            ItemService.getDiscountedBill(this.state.username).then((res) => {
                this.setState({ totalDiscountedBill: res.data });
            });
        }

    }

    isDiscounted(item) {
        if (item == "true") {
            return <i className="fa fa-check-circle" aria-hidden="true" style={{ color: "#198754" }}></i>
        } else {
            return <i className="fa fa-times-circle" aria-hidden="true" style={{ color: "#DC3545" }}></i>
        }
    }
    saveButton() {
        this.inputSubmit.click();
    }
    addOrUpdateProduct(e) {
        e.preventDefault();
        if (this.state.isOpenUpdate) {
            if (window.confirm('Are you sure you want to update ' + this.state.name + '?')) {
                var inputName = this.state.name;
                var isWhiteSpaces = inputName.replace(/^\s+/, '').replace(/\s+$/, '');
                if (isWhiteSpaces === '') {
                    alert("Invalid item name.");
                    this.setState({ name: '' });
                } else {
                    if (this.state.isPriceDiscounted) {
                        let item = {
                            id: this.state.id,
                            name: this.state.name,
                            price: this.state.price,
                            discounted: this.state.isPriceDiscounted,
                            discountPercentage: this.state.discountPercentage,
                            actualPrice: this.state.actualPrice
                        }

                        ItemService.updateItem(this.state.id, item).then(response => {
                            alert(this.state.name + " is updated successfully!");
                            this.setState({ isOpen: false });
                            window.location.reload(true);
                        });
                    } else {
                        let item = {
                            id: this.state.id,
                            name: this.state.name,
                            price: this.state.price,
                            discounted: false,
                            discountPercentage: 0,
                            actualPrice: this.state.price
                        }

                        ItemService.updateItem(this.state.id, item).then(response => {
                            alert(this.state.name + " is updated successfully!");
                            this.setState({ isOpen: false });
                            window.location.reload(true);
                        });
                    }
                }


            }

        } else {
            var inputName = this.state.name;
            var isWhiteSpaces = inputName.replace(/^\s+/, '').replace(/\s+$/, '');
            if (isWhiteSpaces === '') {
                alert("Invalid item name.");
                this.setState({ name: '' });
            } else {
                let item = {
                    name: this.state.name,
                    price: this.state.price,
                    discounted: this.state.isPriceDiscounted,
                    discountPercentage: this.state.discountPercentage,
                    actualPrice: this.roundToTwo(this.state.actualPrice),
                    madeBy: this.state.username,
                    createdOn: this.state.currentDate
                }

                ItemService.addItem(item).then(response => {
                    alert(this.state.name + " is added successfully!");
                    this.setState({ isOpen: false });
                    window.location.reload(false);
                });

            }


        }

    }
    roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }
    updateDialog(id) {
        ItemService.getItemById(id).then(response => {
            if (response.data.discounted) {
                this.setState({
                    isPriceDiscounted: true,
                    isDisplayShow: "block"
                });
            } else {
                this.setState({
                    isPriceDiscounted: false,
                    isDisplayShow: "none"
                });
            }
            this.setState({
                isOpenUpdate: true,
                isOpen: true,
                id: response.data.id,
                name: response.data.name,
                price: response.data.price,
                discountPercentage: response.data.discountPercentage,
                actualPrice: response.data.actualPrice
            });
        });
    }

    deleteItem(id, name) {
        if (window.confirm('Are you sure you want to delete ' + name + '?')) {
            ItemService.deleteItem(id).then(response => {
                this.setState({ items: this.state.items.filter(item => item.id !== id) });
                alert(name + ' is deleted successfully!');
            });

        }
    }


    idBreak(id) {
        let result = id.substring(0, 8);
        return result
    }

    formatMoney(n) {
        return "₱ " + (Math.round(n * 100) / 100).toLocaleString(undefined, {minimumFractionDigits: 2});
    }

    changeAddUpdate() {
        if (this.state.isOpenUpdate) {
            return <p>Update Item</p>
        } else {
            return <p>Add Item</p>
        }
    }

    buttonShow() {
        if (this.state.isOpenUpdate) {
            return <Button variant="primary" onClick={this.saveButton}>
                Update
            </Button>
        } else {
            return <Button variant="primary" onClick={this.saveButton}>
                Add
            </Button>

        }
    }

    activeAll() {
        if (this.state.selectedList === "all") {
            return { color: "#fff" };
        }
    }
    activeRegular() {
        if (this.state.selectedList === "regular") {
            return { color: "#fff" };
        }
    }
    activeDiscounted() {
        if (this.state.selectedList === "discounted") {
            return { color: "#fff" };
        }
    }

    tbodyData() {
        const tableLeftStyle = {
            margin: "5px 0px",
            padding: "10px 5px",
            background: "#F4F4F2",
            borderRadius: "8px 0 0 8px",

            "&:hover": {
                background: "#BBBFCA"
            }
        }
        const tableMidStyle = {
            margin: "5px -2px",
            padding: "10px 5px",
            background: "#F4F4F2"
        }
        const tableRightStyle = {
            margin: "5px 0px",
            padding: "3px 5px",
            background: "#F4F4F2",
            borderRadius: "0 8px 8px 0"
        }

        if (this.state.selectedList === "regular") {
            return <tbody>
                {
                    this.state.itemsRegular.filter(item => item.id.includes(this.state.filterStr)).map(
                        item =>
                            <tr key={item.id} >
                                <td><div style={tableLeftStyle}>{this.idBreak(item.id)}</div></td>
                                <td><div style={tableMidStyle}>{item.name}</div></td>
                                <td><div style={tableMidStyle}> {this.formatMoney(item.price)}</div></td>
                                <td><div style={tableMidStyle}>{this.isDiscounted(item.discounted)}</div></td>
                                <td><div style={tableMidStyle}>{item.discountPercentage} %</div></td>
                                <td><div style={tableMidStyle}>{this.formatMoney(item.actualPrice)}</div></td>
                                <td>
                                    <div style={tableRightStyle}>
                                        <button onClick={() => this.viewItem(item.id)} className='btn btn-secondary' title="View item"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></button>
                                        <button style={{ marginLeft: "10px" }} onClick={() => this.updateDialog(item.id)} className='btn btn-info' title="Update item"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                                        <button style={{ marginLeft: "10px" }} onClick={() => this.deleteItem(item.id, item.name)} title="Delete item" className='btn btn-danger'><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                                    </div>
                                </td>
                            </tr>

                    )
                }
            </tbody>
        } else if (this.state.selectedList === "discounted") {
            return <tbody>
                {
                    this.state.itemsDiscounted.filter(item => item.id.includes(this.state.filterStr)).map(
                        item =>
                            <tr key={item.id} >
                                <td><div style={tableLeftStyle}>{this.idBreak(item.id)}</div></td>
                                <td><div style={tableMidStyle}>{item.name}</div></td>
                                <td><div style={tableMidStyle}>{this.formatMoney(item.price)}</div></td>
                                <td><div style={tableMidStyle}>{this.isDiscounted(item.discounted)}</div></td>
                                <td><div style={tableMidStyle}>{item.discountPercentage} %</div></td>
                                <td><div style={tableMidStyle}>{this.formatMoney(item.actualPrice)}</div></td>
                                <td>
                                    <div style={tableRightStyle}>
                                        <button onClick={() => this.viewItem(item.id)} className='btn btn-secondary' title="View item"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></button>
                                        <button style={{ marginLeft: "10px" }} onClick={() => this.updateDialog(item.id)} className='btn btn-info' title="Update item"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                                        <button style={{ marginLeft: "10px" }} onClick={() => this.deleteItem(item.id, item.name)} title="Delete item" className='btn btn-danger'><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                                    </div>
                                </td>
                            </tr>

                    )
                }
            </tbody>
        } else {
            return <tbody>
                {
                    this.state.items.filter(item => item.id.includes(this.state.filterStr)).map(
                        item =>
                            <tr key={item.id} >
                                <td><div style={tableLeftStyle}>{this.idBreak(item.id)}</div></td>
                                <td><div style={tableMidStyle}>{item.name}</div></td>
                                <td><div style={tableMidStyle}>{this.formatMoney(item.price)}</div></td>
                                <td><div style={tableMidStyle}>{this.isDiscounted(item.discounted)}</div></td>
                                <td><div style={tableMidStyle}>{item.discountPercentage} %</div></td>
                                <td><div style={tableMidStyle}>{this.formatMoney(item.actualPrice)}</div></td>
                                <td>
                                    <div style={tableRightStyle}>
                                        <button onClick={() => this.viewItem(item.id)} className='btn btn-secondary' title="View item"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></button>
                                        <button style={{ marginLeft: "10px" }} onClick={() => this.updateDialog(item.id)} className='btn btn-info' title="Update item"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                                        <button style={{ marginLeft: "10px" }} onClick={() => this.deleteItem(item.id, item.name)} title="Delete item" className='btn btn-danger'><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                                    </div>
                                </td>
                            </tr>
                    )
                }
            </tbody>
        }

    }

    totalBillPara() {
        var totalBill = this.formatMoney(this.state.totalBill);
        var totalRegularBill = this.formatMoney(this.state.totalRegularBill);
        var totalDiscountedBill = this.formatMoney(this.state.totalDiscountedBill);
        if (this.state.selectedList === "all") {
            return totalBill;
        } else if (this.state.selectedList === "regular") {
            return totalRegularBill;
        } else if (this.state.selectedList === "discounted") {
            return totalDiscountedBill;
        } else {
            return 0;
        }
    }
    exportItemPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Grocery Bill Application \n ID #: " + this.state.id + "\n ITEM NAME: " + this.state.name + "\n CREATED DATE: " + this.state.createdOn;
        const headers = [["PRICE", "IS DISCOUNTED", "DISCOUNT PERCENTAGE", "ACTUAL PRICE"]];

        const data = [["$ " + this.state.price, this.state.isPriceDiscounted, this.state.discountPercentage + " %", "$ " + this.state.actualPrice]];

        let content = {
            startY: 150,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("item-receipt-" + this.state.id + ".pdf");
    }

    exportItemAllPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Items List [All] (" + this.state.currentDate + ") <Total Bill: $" + this.state.totalBill + ">";
        const headers = [["ID", "NAME", "PRICE", "IS DISCOUNTED", "DISCOUNT PERCENTAGE", "ACTUAL PRICE"]];

        const data = this.state.items.map(item => [item.id, item.name, "$ " + item.price, item.discounted, item.discountPercentage + " %", "$ " + item.actualPrice]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report-items-all " + this.state.currentDate + ".pdf");
        this.setState({ isOpenPrint: false });
    }
    exportItemRegPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Items List [Regular] (" + this.state.currentDate + ") <Total Bill: $" + this.state.totalRegularBill + ">";
        const headers = [["ID", "NAME", "PRICE", "IS DISCOUNTED", "DISCOUNT PERCENTAGE", "ACTUAL PRICE"]];

        const data = this.state.itemsRegular.map(item => [item.id, item.name, "$ " + item.price, item.discounted, item.discountPercentage + " %", "$ " + item.actualPrice]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report-items-regular " + this.state.currentDate + ".pdf");
        this.setState({ isOpenPrint: false });
    }
    exportItemDiscPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Items List [Discounted] (" + this.state.currentDate + ") <Total Bill: $" + this.state.totalDiscountedBill + ">";
        const headers = [["ID", "NAME", "PRICE", "IS DISCOUNTED", "DISCOUNT PERCENTAGE", "ACTUAL PRICE"]];

        const data = this.state.itemsDiscounted.map(item => [item.id, item.name, "$ " + item.price, item.discounted, item.discountPercentage + " %", "$ " + item.actualPrice]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report-items-discounted " + this.state.currentDate + ".pdf");
        this.setState({ isOpenPrint: false });
    }

    render() {
        const mystyle = {
            display: this.state.isDisplayShow
        };
        const thLeftStyle = {
            margin: "5px 0px",
            padding: "10px 5px",
            background: "#BBBFCA",
            borderRadius: "8px 0 0 8px"
        }
        const thMidStyle = {
            margin: "5px -2px",
            padding: "10px 5px",
            background: "#BBBFCA"
        }
        const thRightStyle = {
            margin: "5px 0px",
            padding: "10px 5px",
            background: "#BBBFCA",
            borderRadius: "0 8px 8px 0"
        }
    
        return (
            <div className="col-sm min-vh-100">
                <div>
                    <nav className="navbar navbar-expand-lg navbar-dark " style={{ background: "#BBBFCA", position: "fixed", width: "82%", borderRadius: "0px 0px 8px 8px" }}>
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#" style={{ color: "#000" }}>Dashboard</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <a className="nav-link" style={this.activeAll()} href="#" onClick={this.onClickAll}>All</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" style={this.activeRegular()} href="#" onClick={this.onClickRegular}>Regular</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" style={this.activeDiscounted()} href="#" onClick={this.onClickDiscounted}>Discounted</a>
                                    </li>
                                </ul>
                                <form className="d-flex">
                                    <div class="inner-addon left-addon">
                                        <i class="fa fa-search" style={{color: "#BBBFCA"}} aria-hidden="true"></i>
                                        <input class="form-control me-2" type="search" placeholder="Search by ID" value={this.state.filterStr} onChange={this.searchBoxFilter} aria-label="Search" />
                                    </div>

                                    <button type="button" className="btn btn-warning d-flex" title='Add item' style={{ marginLeft: "10px" }} onClick={this.openModal}>
                                        <span className="btn-label"><i className="fa fa-plus-circle" aria-hidden="true"></i></span></button>
                                    <button type="button" className="btn btn-success d-flex" title='Print item list' style={{ marginLeft: "10px" }} onClick={this.openModalPrint}>
                                        <span className="btn-label"><i className="fa fa-print" aria-hidden="true"></i></span></button>
                                </form>
                            </div>
                        </div>
                    </nav>

                </div>
                <div className='container' style={{ marginTop: "50px"}}>
                    <div>
                        <div className='row'>
                            <table className='' style={{ textAlign: "left", marginTop: "50px", marginBottom: "8px" }}>
                                <thead>
                                    <tr>
                                        <th><div style={thLeftStyle}>ID</div></th>
                                        <th><div style={thMidStyle}>Name</div></th>
                                        <th><div style={thMidStyle}>Price</div></th>
                                        <th><div style={thMidStyle}>Discounted</div></th>
                                        <th><div style={thMidStyle}>Discount Percentage</div></th>
                                        <th><div style={thMidStyle}>Actual Price</div></th>
                                        <th><div style={thRightStyle}>Actions</div></th>
                                    </tr>
                                </thead>
                                {this.tbodyData()}
                            </table>
                            <div className='total-div'>
                                <p>Total Bill: <b style={{fontSize: "18px"}}>{this.totalBillPara()}</b></p>
                            </div>
                        </div>
                        <Modal show={this.state.isOpen} onHide={this.closeModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>{this.changeAddUpdate()}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={this.addOrUpdateProduct}>
                                    <div className='form-group'>
                                        <label>Name: </label>
                                        <input placeholder='Name' name='productName' className='form-control' value={this.state.name} onChange={this.onChangeName} required />
                                    </div>
                                    <div className='form-group'>
                                        <label>Price: </label>
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input placeholder='Price' type="number" name='productPrice' className='form-control' value={this.state.price} onChange={this.onChangePrice} required />
                                        </div>
                                    </div>
                                    <div className="form-group" >
                                        <label>Discounted: </label>
                                        <br />
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value={true} checked={this.state.isPriceDiscounted === true} onChange={this.onChangeValueYes} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault1" style={{ marginLeft: "10px" }} > Yes</label>
                                        <br />
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value={false} checked={this.state.isPriceDiscounted === false} onChange={this.onChangeValueNo} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault1" style={{ marginLeft: "10px" }}> No</label>
                                    </div>
                                    <div className='form-group' style={mystyle}>
                                        <label>Discount Percentage: </label>
                                        <div className="input-group">
                                            <input type="number" placeholder='Discount Percentage' min={0} max={100} className="form-control" value={this.state.discountPercentage} onChange={this.onChangeDiscountPercentage} />
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>
                                    <div className='form-group' style={mystyle}>
                                        <label>New Price: </label>
                                        <input value={this.state.actualPrice} type="number" name='productPrice' className='form-control' value={this.state.actualPrice} disabled={true} />
                                    </div>
                                    <input type="submit" ref={input => this.inputSubmit = input} style={{ display: "none" }} name="submit" />

                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                {this.buttonShow()}
                                <Button variant="secondary" onClick={this.closeModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={this.state.isOpenView} onHide={this.closeModalView}>
                            <Modal.Header closeButton>
                                <Modal.Title>View Item</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className='form-group'>
                                        <label>Item ID: </label>
                                        <input placeholder='id' name='id' className='form-control' value={this.state.id} disabled={true} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Name: </label>
                                        <input placeholder='Name' name='productName' className='form-control' value={this.state.name} disabled={true} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Price: </label>
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input placeholder='Price' type="number" name='productPrice' className='form-control' value={this.state.price} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="form-group" >
                                        <label>Discounted: </label>
                                        <br />
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value={true} checked={this.state.isPriceDiscounted === true} disabled={true} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault1" style={{ marginLeft: "10px" }} > Yes</label>
                                        <br />
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value={false} checked={this.state.isPriceDiscounted === false} disabled={true} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault1" style={{ marginLeft: "10px" }}> No</label>
                                    </div>
                                    <div className='form-group' style={mystyle}>
                                        <label>Discount Percentage: </label>
                                        <div className="input-group">
                                            <input type="number" placeholder='Discount Percentage' min={0} max={100} className="form-control" value={this.state.discountPercentage} disabled={true} />
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>
                                    <div className='form-group' style={mystyle}>
                                        <label>New Price: </label>
                                        <input value={this.state.actualPrice} type="number" name='productPrice' className='form-control' value={this.state.actualPrice} disabled={true} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Created date:</label>
                                        <input value={this.state.createdOn} type="text" name='productPrice' className='form-control' disabled={true} />
                                    </div>
                                    <input type="submit" ref={input => this.inputSubmit = input} style={{ display: "none" }} name="submit" />

                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="info" title='Update Item' onClick={() => { this.updateDialog(this.state.id); this.closeModalView(); }}>
                                    <span className="btn-label"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span>
                                </Button>
                                <Button variant="success" title='Print Receipt' onClick={() => this.exportItemPDF()}>
                                    <span className="btn-label"><i className="fa fa-print" aria-hidden="true"></i></span>
                                </Button>
                                <Button variant="secondary" onClick={this.closeModalView}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={this.state.isOpenPrint} onHide={this.closeModalPrint}>
                            <Modal.Header closeButton>
                                <Modal.Title>Print Item List</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Button variant="secondary" style={{ margin: "0px 10px" }} onClick={() => this.exportItemAllPDF()}><i className="fa fa-list-ul" aria-hidden="true"></i> Print All</Button>
                                <Button variant="info" style={{ margin: "0px 10px" }} onClick={() => this.exportItemRegPDF()}><i className="fa fa-usd" aria-hidden="true"></i> Print Regular</Button>
                                <Button variant="danger" style={{ margin: "0px 10px" }} onClick={() => this.exportItemDiscPDF()}><i className="fa fa-percent" aria-hidden="true"></i> Print Discounted</Button>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.closeModalPrint}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ItemComponent);