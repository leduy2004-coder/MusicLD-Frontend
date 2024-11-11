import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo context
const FormContext = createContext();

// Hàm mở và truy cập IndexedDB
const openIndexedDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('formDataStore', 1);

        // Tạo object store khi database được tạo lần đầu
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('formData')) {
                db.createObjectStore('formData', { keyPath: 'id' }); // KeyPath là 'id' (bạn có thể thay đổi nếu cần)
            }
        };

        request.onsuccess = (e) => {
            resolve(e.target.result); // Trả về db
        };

        request.onerror = (e) => {
            reject(e.target.error);
        };
    });
};

// Hàm lưu formData vào IndexedDB
const saveFormDataToIndexedDB = async (data) => {
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction('formData', 'readwrite');
        const store = transaction.objectStore('formData');
        store.put({ id: 'formData', ...data }); // Lưu dữ liệu dưới key 'formData'
        transaction.oncomplete = () => {
            console.log('Form data saved to IndexedDB');
        };
        transaction.onerror = () => {
            console.error('Error saving data to IndexedDB');
        };
    } catch (error) {
        console.error('Error accessing IndexedDB:', error);
    }
};

// Hàm lấy formData từ IndexedDB
const getFormDataFromIndexedDB = async () => {
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction('formData', 'readonly');
        const store = transaction.objectStore('formData');
        const request = store.get('formData'); // Lấy dữ liệu với key 'formData'

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result ? request.result : null); // Nếu không có dữ liệu, trả về null
            };
            request.onerror = () => {
                reject('Error retrieving data from IndexedDB');
            };
        });
    } catch (error) {
        console.error('Error accessing IndexedDB:', error);
        return null;
    }
};

// Provider để chia sẻ dữ liệu cho các component khác
export const FormProvider = ({ children }) => {
    const initialFormData = {
        songName: '',
        avatar: null,
        file: null,
        lyrics: '',
        access: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        // Khi component mount, lấy dữ liệu từ IndexedDB nếu có
        const loadData = async () => {
            const savedData = await getFormDataFromIndexedDB();
            if (savedData) {
                setFormData(savedData); // Nếu có dữ liệu, cập nhật state
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        // Lưu formData vào IndexedDB khi nó thay đổi
        saveFormDataToIndexedDB(formData);
    }, [formData]);

    // Hàm lưu dữ liệu vào Context
    const saveFormData = (data) => {
        const formDataObj = {};

        for (let [key, value] of data.entries()) {
            formDataObj[key] = value;
        }

        setFormData((prevData) => ({
            ...prevData,
            songName: formDataObj.songName,
            avatar: formDataObj.avatar,
            file: formDataObj.file,
            lyrics: formDataObj.lyrics,
            access: formDataObj.access,
        }));
    };

    const resetFormData = () => {
        setFormData(initialFormData);
        // Xóa dữ liệu trong IndexedDB khi reset
        openIndexedDB().then((db) => {
            const transaction = db.transaction('formData', 'readwrite');
            const store = transaction.objectStore('formData');
            store.delete('formData'); // Xóa dữ liệu theo key 'formData'
        });
    };

    return (
        <FormContext.Provider value={{ formData, saveFormData, resetFormData }}>
            {children}
        </FormContext.Provider>
    );
};

// Hook để sử dụng Context trong component khác
export const useFormContext = () => {
    return useContext(FormContext);
};
