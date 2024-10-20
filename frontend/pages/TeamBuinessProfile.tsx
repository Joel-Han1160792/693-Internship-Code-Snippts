import UserProfile from "../../../components/profile/UserProfile";
import About from "../../../components/profile/sections/About";
import Links from "../../../components/profile/sections/Links";
import useUserDetails from "../../../utils/hooks/user/useUserDetails";

const TeamBusinessProfile = () => {
  const { about } = useUserDetails();

  return (
    <UserProfile>
      <About id="about" profileTitle="About Us" sectionText={about} />
      <Links id="links" profileTitle="Links" end />
    </UserProfile>
  );
};

export default TeamBusinessProfile;
