import { useContext } from "react";
import {
  useLocation,
  Link,
  useNavigate,
  Route,
  Routes,
} from "react-router-dom";
import { setAuthToken } from "../utils/token.js";
import { AuthContext } from "../utils/contexts.js";
import {
  LeftGroup,
  Text,
  PageDiv,
  TitleImg,
  LinkContainer,
} from "../components/Members/menu.js";
import {
  RightGroup,
} from "../components/Members/function.js"; 
import MatchApplication from "../components/Members/MatchApplicationElement.js";
import MatchListElement from "../components/Members/MatchListElement.js";
import AdoptionListElement from "../components/Members/AdoptListElement.js";
const logoutImg = "/images/logout.png";

export function Members() {
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const catBowlImg = "/images/cat-bowl.png";
  const dogBowlImg = "/images/dog-bowl.png";
  const handleLogout = () => {
    setAuthToken("");
    setUser(null);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <PageDiv>
      <LeftGroup>
        <LinkContainer>
          <TitleImg src={dogBowlImg} />
          <Link
            to="/members/adoption-list"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Text>寵物名單</Text>
          </Link>
        </LinkContainer>
        {/* <LinkContainer>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            <TitleImg src={starImg} />
            <Text>走失協尋</Text>
          </Link>
        </LinkContainer> */}
        {/* <LinkContainer>
          <TitleImg src={catBowlImg} />
          <Text>通報救援</Text>
        </LinkContainer> */}
        <LinkContainer>
          <TitleImg src={dogBowlImg} />
          <Link to="/members/match-list"
            style={{ textDecoration: "none", color: "inherit" }}>
            <Text>配對名單</Text>
          </Link>
        </LinkContainer>
        <LinkContainer>
          <TitleImg src={catBowlImg} />
          <Link
            to="/members/match-application"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Text>申請配對通知</Text>
          </Link>
        </LinkContainer>
        {/* <LinkContainer>
          <TitleImg src={dogBowlImg} />
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            <Text>關注寵寵</Text>
          </Link>
        </LinkContainer> */}
        <LinkContainer style={{justifyContent:"center",alignSelf:"center"}}>
        <TitleImg src={logoutImg} />
        <Text onClick={handleLogout}>登出</Text>
        </LinkContainer>
      </LeftGroup>
      <RightGroup>
        <Routes>
          <Route path="adoption-list" element={<AdoptionListElement />} />
          {/* <Route path="/lost-and-found" element={<LostAndFound />} /> */}
          {/* <Route path="/report-rescue" element={<ReportRescue />} /> */}
          <Route path="match-list" element={<MatchListElement />} />
          <Route path="match-application" element={<MatchApplication />} />
          {/* <Route path="/follow-pets" element={<FollowPets />} /> */}
        </Routes>
      </RightGroup>
    </PageDiv>
  );
}
