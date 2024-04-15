import { ProCard } from "@ant-design/pro-components";
import { Button, Space } from "antd";
import styled from "styled-components";
import { device } from "../../utils/breakpoints";

export const ImageContainer = styled.div`
  position: relative;
  height: 190px;
  overflow: hidden;
  border-radius: 15px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
    will-change: transform;
    transform-origin: center center;
    transition: transform 1s;
    border: 2px solid white;
  }

  &:hover img {
    transform: scale(1.2);
  }
  @media ${device.mobile} {
    border-radius: 10px;
    height: 120px;
  }
`;

export const ImageDisplay = styled.div`
  position: relative;
  width: 400px;
  height: 320px;
  overflow: hidden;
  border-radius: 15px;
  margin: 0 auto;

  img {
    width: 80%;
    height: 80%;
    object-fit: cover;
    border: 2px solid white;
    border-radius: 5px;
  }
`;

export const ContainerText = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 10px;

  @media ${device.mobile} {
    grid-template-rows: 1.2fr 1fr 1fr;
    grid-row-gap: 2px;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
  height: 50px;
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: 12px;
  @media ${device.mobile} {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 6px;
  }
`;

export const CardContent = styled.div`
  display: grid;
  margin: 0 auto;
  @media ${device.desktop} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
  }
  @media ${device.mobile} {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }
`;

export const CardWrapper = styled.div`
  /* width: 24%;
  margin: 5px; */
`;

export const RecipeCard = styled(ProCard)`
  margin: 0 auto;
  max-width: 300px;

  @media ${device.mobile} {
    .ant-pro-card-body {
      padding-inline: 10px;
    }
  }
`;

export const SpaceStyle = styled(Space)`
  display: flex;
  margin-bottom: 8px;
`;
export const TextLine = styled.span`
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
  @media ${device.mobile} {
    font-size: 14px;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const RecipeButton = styled(Button)`
  width: 100%;

  @media ${device.mobile} {
    font-size: 14px;
  }
`;
export const Detail = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Description = styled.div`
  border: dashed 2px #bad4d4;
  padding: 10px;
`;
export const DescriptionText = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const TipsContainer = styled.div`
  margin: 24px 0;
  background-color: #bad4d4;
  padding: 10px 10px;
  border-radius: 5px;
  font-size: 16px;
`;

export const TipsTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: #fec740;
  width: 75px;
  border-radius: 5px;
  justify-content: space-around;
  padding-top: 2px;
`;

export const Tips = styled.mark`
  display: inline-block;

  background-color: #fec740;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
`;

export const StepsContainer = styled.div`
  font-size: 16px;
  padding: 5px;
  line-height: 24px;
`;

export const StepsTag = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

export const LinkContainer = styled.div`
  max-width: 600px;
  word-wrap: break-word;
  font-size: 16px;
`;
export const IngredientsWrapper = styled.div`
  width: 550px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0 auto;

  @media ${device.mobile} {
    width: 380px;
    margin: 0;
    display: block;
  }
`;

export const IngredientsContainer = styled.div`
  width: 48%;
  display: flex;
  flex-direction: row;
  margin: 5px 0;
  flex-wrap: nowrap;
  font-size: 16px;
  @media ${device.mobile} {
    width: 100%;
    font-size: 14px;
  }
`;

export const IngredientsItem = styled.div`
  width: 40%;
  line-height: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
`;

export const IngredientsOrder = styled.div`
  width: 20px;
  margin-right: 5px;
  line-height: 24px;
`;
export const LoadingSpinner = styled.img`
  width: 100%;
  height: 80%;
  margin: 0 auto;
  background-position: center;
`;
