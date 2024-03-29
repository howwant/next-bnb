import axios from ".";
import { RegisterRoomState } from "../../types/rooms";
import { RoomType } from "../../types/rooms";
import { makeQueryString } from "../utils";

// 숙소 등록하기
export const registerRoomAPI = (body: RegisterRoomState & {hostId: number}) =>{
    axios.post("/api/rooms", body);
}

//* 숙소 리스트 불러오기
type GetRoomListAPIQueries = {
    location? : string | string[];
    checkInDate?: string | string[];
    checkOutDate?: string | string[];
    adultCount?: string | string[];
    childrenCount?: string | string[];
    infantsCount?: string | string[];
    latitude?: string | string[];
    longitude?: string | string[];
    limit: string | string[];
    page: string | string[];
};

export const getRoomListAPI = (queries : GetRoomListAPIQueries) =>{
    return axios.get<RoomType[]>(makeQueryString("/api/rooms", queries));
};
// 숙소 하나 불러오기
export const getRoomAPI = (roomId: number) => {
    return axios.get<RoomType>(`api/rooms/${roomId}`);
}