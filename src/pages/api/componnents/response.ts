import { NextApiResponse } from "next";
export const response = (statusCode:number, data : unknown, message :string, res:NextApiResponse) =>{
    res.status(statusCode).json({
        datas:data,
        message:message
    })
}