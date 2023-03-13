import React from "react";
import { NextPage } from "next";
import { wrapper } from "../../store";
import RoomMain from "../../components/room/main/RoomMain";
import { getRoomListAPI } from "../../lib/api/room";
import { roomActions } from "../../store/room";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { RoomType } from "../../types/rooms";
import { useDispatch } from "react-redux";

interface IProps {
    rooms : RoomType[];
  }

  const index:NextPage<IProps> = ({rooms}) => {
    const dispatch = useDispatch();
    dispatch(roomActions.setRooms(rooms));
  
    return <RoomMain />;
  };
  
export const getServerSideProps = async (context : GetServerSidePropsContext ) => {

        const {
            checkInDate,
            checkOutDate,
            adultCount,
            childrenCount,
            latitude,
            longitude,
            limit,
            page = "1"
        } = context.query;

        try {
            const { data: rooms } = await getRoomListAPI({
                checkInDate,
                checkOutDate,
                adultCount,
                childrenCount,
                latitude,
                longitude,
                limit: limit || '20',
                page : page || "1",
                //? 한글은 encode 해주세요.
                location: context.query.location
                    ? encodeURI(context.query.location as string)
                    :undefined,
            });
            console.log(rooms);
            return {
                props: {
                    rooms,
                }
            }
        } catch (e) {
            console.log(e);
        }
    return {};
}

export default index;