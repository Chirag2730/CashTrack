export const BASE_URL= import.meta.env.MODE === "development"? "http://localhost:8000/api" : "/api" ;

export const API_PATHS={
    AUTH:{
        LOGIN:"/v1/auth/login",
        REGISTER:"/v1/auth/register",
        GET_USER_INFO:"/v1/auth/getUser",
    },
    DASHBOARD:{
        GET_DATA:"/v1/dashboard",
    },
    INCOME:{
        ADD_INCOME:"/v1/income/add",
        GET_ALL_INCOME:"/v1/income/get",
        DELETE_INCOME:(incomeId)=>`/v1/income/delete/${incomeId}`,
        DOWNLOAD_INCOME:`/v1/income/downloadexcel`,
    },
    EXPENSE:{
        ADD_EXPENSE:"/v1/expense/add",
        GET_ALL_EXPENSE:"/v1/expense/get",
        DELETE_EXPENSE:(expenseId)=>`/v1/expense/delete/${expenseId}`,
        DOWNLOAD_EXPENSE:`/v1/expense/downloadexcel`,
    },
    IMAGE:{
        UPLOAD_IMAGE:"/v1/auth/upload-image"
    },
};