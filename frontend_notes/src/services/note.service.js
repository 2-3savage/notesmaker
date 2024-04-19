import axios from 'axios'

export const NoteService = {
    async addMemberInItem(userId, itemId){
        const response = await fetch(`http://127.0.0.1:8000/api/item/${userId}/add/${itemId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.json()
    },
    async removeMemberInItem(userId, itemId){
        const response = await fetch(`http://127.0.0.1:8000/api/item/${userId}/remove/${itemId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.json()
    },
    async updateBoardChange(board_id, table_id, table_id_2){
        let response = await fetch(`http://127.0.0.1:8000/api/update/${board_id}/${table_id}/${table_id_2}/tables`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        return response.json();
    },
    async updateItemDropInYourBoard(board_id, table_id, item_id){
        let response = await fetch(`http://127.0.0.1:8000/api/update/${board_id}/${table_id}/${item_id}/item/drop/board`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        return response.json();
    },
    async updateItemDropInBoard(board_id, table_id, table_id_2, item_id){
        let response = await fetch(`http://127.0.0.1:8000/api/update/${board_id}/${table_id}/${table_id_2}/${item_id}/item/drop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        return response.json();
    },
    async updateItemDragOnDropInBoard(board_id, item_id, item_id_2){
        let response = await fetch(`http://127.0.0.1:8000/api/update/${board_id}/${item_id}/${item_id_2}/item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        return response.json();
    },
    async updateItemDragOnDropItemBoards(board_id, tables_id, tables_id_2, item_id, item_id_2){
        let response = await fetch(`http://127.0.0.1:8000/api/update/${board_id}/${tables_id}/${tables_id_2}/${item_id}/${item_id_2}/item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        return response.json();
    },
    async updateInvestment(id, investment){
        let response = await fetch(`http://127.0.0.1:8000/api/investment/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(investment)
        });
    
        return response.json();
    },
    async deleteInvestment(board_id, id) {
        let responce = await fetch(`http://127.0.0.1:8000/api/investment/${board_id}/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        )
        return responce.json()
    },
    async addInvestment(document, investment, itemId) {
        const formData = new FormData();
        formData.append('document', document);
        formData.append('investment', investment);
        formData.append('item', itemId);
        let response = await fetch('http://127.0.0.1:8000/api/investment/item/create/', {
            method: 'POST',
            body: formData
        });
    
        return response.json();
    },
    async getFavoritesBoards(authTokens){
        let responce = await fetch(`http://127.0.0.1:8000/api/user/info/favorites/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }
        )
        return responce.json()
    },
    async updateInvite(authTokens, boardId, userId, is_read){
        let responce = await fetch(`http://127.0.0.1:8000/api/invite/${userId}/update/${boardId}/read/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(is_read)
        }
        )
        return responce.json()
    },
    async createInvite(authTokens, userId, boardId){
        let responce = await fetch(`http://127.0.0.1:8000/api/invite/${userId}/create/${boardId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }
        )
        return responce.json()
    },
    async responceInvite(authTokens, boardId, userId, status){
        let responce = await fetch(`http://127.0.0.1:8000/api/invite/${userId}/update/${boardId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(status)
        }
        )
        return responce.json()
    },
    async updateBoardUser(boardId, userId, right){
        let responce = await fetch(`http://127.0.0.1:8000/api/page/${userId}/board/${boardId}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(right)
        }
        )
        return responce.json()
    },
    async searchUser(email){
        let responce = await fetch(`http://127.0.0.1:8000/api/search/user/${email}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        )
        return responce.json()
    },
    async removeUserInBoard(boardId, userId){
        let responce = await fetch(`http://127.0.0.1:8000/api/page/${userId}/board/${boardId}/remove/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            
        }
        )
        return responce.json()
    },
    async addUserInBoard(boardId, userId, right){
        let responce = await fetch(`http://127.0.0.1:8000/api/page/${userId}/board/${boardId}/add/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(right)
        }
        )
        return responce.json()
    },
    async addBoardFavorite(boardId, userId){
        let responce = await fetch(`http://127.0.0.1:8000/api/user/${userId}/board_like/${boardId}/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        )
        return responce.json()
    },
    async removeBoardFavorite(boardId, userId){
        let responce = await fetch(`http://127.0.0.1:8000/api/user/${userId}/board_like/${boardId}/remove/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        )
        return responce.json()
    },
    async getUserInfoBoard(authTokens, board_id){
        let responce = await fetch(`http://127.0.0.1:8000/api/user/info/${board_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }
        )
        if (responce.status === 200) {
            let data = await responce.json()
            return data
        }
    },
    async getUserInfo(authTokens){
        let responce = await fetch(`http://127.0.0.1:8000/api/user/info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }
        )
        if (responce.status === 200) {
            let data = await responce.json()
            return data
        }
    },
    async getAll(authTokens){
        let responce = await fetch(`http://127.0.0.1:8000/api/pages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }
        )
        if (responce.status === 200) {
            let data = await responce.json()
            return data
        }else if (responce.statusText === 'Unauthorized'){
            return -1
        }else{
            return 0
        }
        
    },
    async createPage(page){
        const response = await fetch(`http://127.0.0.1:8000/api/page/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(page)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async createTable(table){
        const response = await fetch(`http://127.0.0.1:8000/api/table/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(table)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async createItem(item){
        const response = await fetch(`http://127.0.0.1:8000/api/item/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async createDate(date){
        const response = await fetch(`http://127.0.0.1:8000/api/date/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(date)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async createTag(tag){
        const response = await fetch(`http://127.0.0.1:8000/api/tag/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async addTagInItem(tag){
        fetch(`http://127.0.0.1:8000/api/tag/item/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })
    },
    async removeTagInItem(tag){
        fetch(`http://127.0.0.1:8000/api/tag/item/remove/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })
    },
    async updatePage(page, id, authTokens){
        const response = await fetch(`http://127.0.0.1:8000/api/page/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(page)
            
        })
        const data = await response.json();
        return data
    },
    async updateTable(table, id){
        fetch(`http://127.0.0.1:8000/api/table/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(table)
        })
    },
    
    async updateItem(item, id){
        const response = await fetch(`http://127.0.0.1:8000/api/item/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        return response.json()
    },
    
    async updateDate(date, id){
        fetch(`http://127.0.0.1:8000/api/date/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(date)
        })
    },
    async updateTag(tag, id){
        const response = await fetch(`http://127.0.0.1:8000/api/tag/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async deleteTable(board_id, table_id){
        const responce = await fetch(`http://127.0.0.1:8000/api/table/${board_id}/${table_id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        return responce.json()
        
    },
    async deleteItem(board_id, table_id, item_id){
        const responce = await fetch(`http://127.0.0.1:8000/api/item/${board_id}/${table_id}/${item_id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        return responce.json()
    },
    async deleteDate(id){
        fetch(`http://127.0.0.1:8000/api/date/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        
    },
    async deleteTag(id){
        fetch(`http://127.0.0.1:8000/api/tag/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        
    },
    
    
}