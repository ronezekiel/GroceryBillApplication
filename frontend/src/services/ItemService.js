import axios from 'axios';

const ITEM_BASE_API_URL = "http://localhost:8080/api";
const ITEM_REGULAR_BASE_API_URL = "http://localhost:8081/api";
const ITEM_DISCOUNTED_BASE_API_URL = "http://localhost:8082/api";

class ItemService {

    getItemList() {
        return axios.get(ITEM_BASE_API_URL + "/item/view");
    }
    getItemById(id) {
        return axios.get(ITEM_BASE_API_URL + "/item/view/" + id);
    }

    addItem(items) {
        return axios.post(ITEM_BASE_API_URL + "/item/add", items);
    }

    deleteItem(id) {
        return axios.delete(ITEM_BASE_API_URL + "/item/delete/" + id);
    }

    updateItem(id, items) {
        return axios.put(ITEM_BASE_API_URL + "/item/update/" + id, items)
    }

    getRegularItemList() {
        return axios.get(ITEM_REGULAR_BASE_API_URL + "/item/regular");
    }

    getDiscountedItemList() {
        return axios.get(ITEM_DISCOUNTED_BASE_API_URL + "/item/discounted");
    }
    getTotalBill(username) {
        return axios.get(ITEM_BASE_API_URL + "/item/total/" + username);
    }
    getRegularBill(username) {
        return axios.get(ITEM_REGULAR_BASE_API_URL + "/item/regular/" + username);
    }

    getDiscountedBill(username) {
        return axios.get(ITEM_DISCOUNTED_BASE_API_URL + "/item/discounted/" + username);
    }

}
export default new ItemService()