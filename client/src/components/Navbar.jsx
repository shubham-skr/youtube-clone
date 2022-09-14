import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./Upload";
import { loginFailure, loginStart, loginSuccess, logout } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import axios from "axios";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 5%;
  padding: 5px;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.input};
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  width: 90%;
  font-size: 0.9rem;
  padding: 0.3rem;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  position: relative;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #999;
  margin-left: 1rem;
  cursor: pointer;
`

const AvatarDropDown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.input};
  color:  ${({ theme }) => theme.text};
  padding: 0.7rem;
  font-weight: 700;
  text-align: center;
`

// const UserName = styled.div`
//   margin-bottom: 1rem;
// `

const Logout = styled.div`
  cursor: pointer;
`

const Navbar = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [avatarOpen, setAvatarOpen] = useState(false);

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        axios
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            console.log(res)
            dispatch(loginSuccess(res.data));
            navigate("/")
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };

  const signOutHandler = () => {
    setAvatarOpen(false);
    setUploadOpen(false);
    dispatch(logout());
    navigate("/");
  }

  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchOutlinedIcon onClick={()=>navigate(`/search?q=${search}`)}/>
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon onClick={() => setUploadOpen(true)} style={{fontSize: '35px', cursor: 'pointer'}}/>
              <Avatar src={currentUser.img} onClick={() => setAvatarOpen((prev) => !prev)} />
              <AvatarDropDown style={{ display: `${avatarOpen? 'block' : 'none'}`}} >
                {/* <UserName>{currentUser.name}</UserName> */}
                <Logout onClick={signOutHandler}>SIGN&nbsp;OUT</Logout>
              </AvatarDropDown>
            </User>
          ) : (
              <Button onClick={signInWithGoogle} >
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
          )}
        </Wrapper>
      </Container>
      {uploadOpen && <Upload setOpen={setUploadOpen} />}
    </>
  );
};

export default Navbar;
