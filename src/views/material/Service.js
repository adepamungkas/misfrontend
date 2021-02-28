import axios from 'axios';
import swal from 'sweetalert';
import * as CONST from '../../Constant';

const moment = require('moment');
const HEADERS = {
   // 'Content-Type': 'application/json',
    accept: 'application/json',
    'content-type': 'multipart/form-data'
   // Authorization: `Bearer ` + localStorage.getItem('token'), 'x-timezone-offset': moment().utcOffset() / 60
};

class Service {

    createMaterial = (payload) => {
        const url = `${CONST.BASE_URL}materials`;
        var bodyFormData = new FormData();
        bodyFormData.append('Date', payload.Date);
        bodyFormData.append('Name', payload.Name);
        bodyFormData.append('IsBroken', payload.IsBroken);
        bodyFormData.append('Size', payload.Size);
        bodyFormData.append('Color', payload.Color);
        bodyFormData.append('Type', payload.Type);
        bodyFormData.append('Description', payload.Description);
        bodyFormData.append('InputBy', payload.InputBy);
        bodyFormData.append('Trademark', payload.Trademark);
       

        return axios.post(url, bodyFormData, { headers: HEADERS })
            .then(data => {

                return data;
            })
            .catch((err) => {
                throw err;
            });
    }

    editMaterial = (ID, payload) => {
        var bodyFormData = new FormData();
        bodyFormData.append('Date', payload.Date);
        bodyFormData.append('Name', payload.Name);
        bodyFormData.append('IsBroken', payload.IsBroken);
        bodyFormData.append('Size', payload.Size);
        bodyFormData.append('Color', payload.Color);
        bodyFormData.append('Type', payload.Type);
        bodyFormData.append('Description', payload.Description);
        bodyFormData.append('InputBy', payload.InputBy);
        bodyFormData.append('Trademark', payload.Trademark);
       
        let url = `${CONST.BASE_URL}materials/${ID}`;
        return axios.put(url, bodyFormData, { headers: HEADERS })
            .then((result) => {
                return result.data;
            })
            .catch((err) => {
                // console.log(err.response.data.error);
                const error = err.response?.data.error

                throw error;
            });
    }

    getMaterials = (id) => {
        let url = `${CONST.BASE_URL}materials/`;
        return axios.get(url, { headers: HEADERS })
            .then((result) => {
                
                return result.data;
            })
            .catch((err) => {
                const error = err.response?.data?.error

                throw error;
            });
    }

    getMaterialById = (id) => {
        let url = `${CONST.BASE_URL}materials/${id}`;
        return axios.get(url, { headers: HEADERS })
            .then((result) => {
                return result.data;
            })
            .catch((err) => {
                const error = err.response?.data.error

                throw error;
            });
    }

    deleteMaterial = (ID) => {
        console.log("ID",ID)
        let url = `${CONST.BASE_URL}materials/${ID}`;
        return axios.delete(url, { headers: HEADERS })
            .then((result) => {
                return result.data;
            })
            .catch((err) => {
                // console.log(err.response.data.error);
                const error = err.response?.data.error

                throw error;
            });
    }


}

export default Service;
