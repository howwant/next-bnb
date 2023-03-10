import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import palette from "../../../styles/palette";
import { useSelector } from "../../../store";
import { searchRoomActions } from "../../../store/searchRoom";
import useDebounce from '../../../hooks/useDebounce';
import { useDispatch } from "react-redux";
import OutsideClickHandler from "react-outside-click-handler";
import { getPlaceAPI, searchPlacesAPI } from "../../../lib/api/map";
import isEmpty from 'lodash/isEmpty';

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 70px;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    &:hover {
        border-color: ${palette.gray_dd};
    }
    .search-room-bar-location-texts {
        position: absolute;
        width: calc(100% - 40px);
        top: 16px;
        left: 20px;
        .search-room-bar-location-label {
            font-size: 10px;
            font-weight: 800;
            margin-bottom: 4px;
        }
        input {
            width: 100%;
            border: 0;
            font-size: 14px;
            font-weight: 600;
            outline: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &::placeholder {
                font-size: 14ps;
                opacity: 0.7;
            }
        }
    }
    .search-room-bar-location-result {
        position: absolute;
        background-color: white;
        top: 78px;
        width: 500px;
        padding: 16px 0;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        border-radius: 32px;
        cursor: default;
        overflow: hidden;
        z-index: 10;
        li {
            display: flex;
            align-items: center;
            height: 64px;
            padding: 8px 32px;
            cursor: pointer;
            &:hover {
                background-color: ${palette.gray_f7};
            }
        }
    }
`;

const SearchRoomBarLocation:React.FC = () => {
    const location = useSelector((state) => state.searchRoom.location);
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchKeyword = useDebounce(location, 500);
    const [opened, setOpened] = useState(false);
    const [results, setResults] = useState<
    {
        description: string;
        placeId: string;
    }[]>
    ([]);

    const [popupOpened, setPopupOpend] = useState(false);
    const onClickInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setPopupOpend(true);
    }
    //* ?????? ????????????
    const searchPlaces = async () => {
        try {
            const { data }:any = await searchPlacesAPI(encodeURI(location));
            setResults(data);
        }   catch(e) {
            console.log(e);
        }
    };
    //* ???????????? ????????? ????????? ??????
	useEffect(() => {
		if (!searchKeyword) {
			setResults([]);
		}
		if (searchKeyword) {
			searchPlaces();
		}
	}, [searchKeyword]);

    	// ?????? ?????? dispatch
	const setLocationDispatch = (value: string) => {
		dispatch(searchRoomActions.setLocation(value));
	};

	// ?????? ?????? dispatch
	const setLatitudeDispatch = (value: number) => {
		dispatch(searchRoomActions.setLatitude(value));
	};

	// ?????? ?????? dispatch
	const setLongitudeDispatch = (value: number) => {
		dispatch(searchRoomActions.setLongitude(value));
	};

	// ?????? ?????? ?????? ?????? ???
	const onClickNearPlaces = () => {
		setOpened(false);
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				setLocationDispatch('?????? ?????? ??????');
				setLatitudeDispatch(coords.latitude);
				setLongitudeDispatch(coords.longitude);
			},
			(e) => {
				console.log(e);
			}
		);
	};
    // ????????? ?????? ?????? ???
    const onClickResult = async (placeId: string) =>{
        try{
        const {data} = await getPlaceAPI(placeId);
        setLocationDispatch(data.location);
        setLatitudeDispatch(data.latitude);
        setLongitudeDispatch(data.longitude);
        setPopupOpend(false);
        } catch(e){
            console.log(e);
        }
    }

    return (
        <Container onClick={onClickInput}>
            <OutsideClickHandler onOutsideClick={() => setPopupOpend(false)}>
                <div className="search-room-bar-location-texts">
                    <p className="search-room-bar-location-label">??????</p>
                    <input
                        value={location}
                        onChange={(e) => setLocationDispatch(e.target.value)}
                        placeholder="????????? ?????? ??????????"
                        ref={inputRef}
                        />
                </div>
                {popupOpened && location !== "?????? ?????? ??????" && (
                <ul className="search-room-bar-location-result">
                    {!location && (
                        <li role='presentation' onClick={onClickNearPlaces}>
                            ?????? ?????? ??????
                        </li>
                    )}
                    {!isEmpty(results) &&
                    results.map((result, index) => (
                        <li key={index} onClick={() => onClickResult(result.placeId)}>{result.description}</li>
                    ))}
                    {location && isEmpty(results) && <li>?????? ????????? ????????????.</li>}
                </ul>
        )}
            </OutsideClickHandler>
        </Container>
    );
}

export default SearchRoomBarLocation;