import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #313538;

  @media screen and (max-width: 1279px) {
    bottom: 60px;
  }
`;
const Copywright = styled.div`
  margin-left: 30px;
  line-height: 17px;
  font-size: 12px;
  color: #828282;

  @media screen and (max-width: 1279px) {
    margin-left: 0;
    margin-top: 7px;
    line-height: 14px;
    font-size: 10px;
    color: #828282;
    width: 100%;
    text-align: center;
  }
`;
function Footer() {
  return (
    <Wrapper>
      <div>Cook cook for you </div>
      <Copywright>© 2023. All rights reserved.</Copywright>
    </Wrapper>
  );
}

export default Footer;
