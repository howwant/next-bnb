import { useSelector } from "../../../store";
import RegisterRoomBedTypes from "./RegisterRoomBedTypes"
import RegisterRoomPublicBedTypes from "./RegisterRoomPublicBedTypes";

const RegisterRoomBedList:React.FC = () => {
    const bedList = useSelector((state) => state.registerRoom.bedList);

    return (
        <ul className="register-room-bed-type-list-wrapper" style={{width:548}}>
        {bedList.map((bedroom) => (
            <RegisterRoomBedTypes bedroom={bedroom} key={bedroom.id} />
        ))}
        <RegisterRoomPublicBedTypes />
    </ul>
    )
}
export default RegisterRoomBedList;