import { NextPage } from "next";
import RoomDetail from "../../components/room/detail/RoomDetail";
import { getRoomAPI } from "../../lib/api/room";
import { roomActions } from "../../store/room";

const roomDatail: NextPage = () => {
    return <RoomDetail/>;
};

roomDatail.getInitialProps = async ({ query, store}) => {
    const { id } = query;

    try {
        if (id) {
            const { data } = await getRoomAPI(Number(id as string));
            store.dispatch(roomActions.setDetailRoom(data));
            console.log(data);
        }
    } catch (e) {
        console.log(e);
    }
    return {};
};

export default roomDatail;