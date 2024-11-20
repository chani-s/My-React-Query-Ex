import http from "./http";

export async function getAllItems() {
    try {
        const response = await http.get("/items");
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export async function createItem(item: any) {
    try {
        const response = await http.post("/items", item);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export async function updateItem(id: string, item: any) {
    try {
        const response = await http.patch('/items', { ...item, _id: id });
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export async function deleteItem(id: string) {
    try {
        const response = await http.delete(`/items/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

