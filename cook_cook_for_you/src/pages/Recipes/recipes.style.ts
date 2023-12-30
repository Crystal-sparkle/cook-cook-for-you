import styled from "styled-components";

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
`;

export const ImageDisplay = styled.div`
  position: relative;
  width: 340px;
  height: 250px;
  overflow: hidden;
  border-radius: 15px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    border: 2px solid white;
  }
`;

export const TitleContent = styled.div`
  min-height: 50px;
  margin-bottom: 3px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  row-gap: 20px;
  align-items: center;
  margin: 0 auto;
  justify-content: start;
`;

export const CardWrapper = styled.div`
  width: 24%;
  margin: 5px;
`;
export const TextLine = styled.span`
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
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
`;

export const IngredientsContainer = styled.div`
  width: 48%;
  display: flex;
  flex-direction: row;
  margin: 5px 0;
  flex-wrap: nowrap;
  font-size: 16px;
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
  width: 80%;
  height: 80%;
  margin: 0 auto;
  background-position: center;
`;
