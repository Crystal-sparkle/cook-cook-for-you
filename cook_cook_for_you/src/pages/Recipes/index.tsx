import styled from "styled-components";
import RecipeDisplay from "./RecipeDisplay";
import RecipeForm from "./RecipeForm";
import banner1 from "./banner1.jpeg";

const Wrapper = styled.div`
  margin: 20px;
  padding: 10px;
  border-radius: 20px;
  display: flex;
`;
const BannerImg = styled.div`
  background-size: cover;
  background-image: url(${banner1});
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: flex;
  align-items: center;
`;

const Recipes: React.FC = () => {
  return (
    <div>
      <BannerImg>
        <div style={{ margin: "0 auto" }}>
          <RecipeForm />
        </div>
      </BannerImg>
      <Wrapper>
        <div>
          <h1>食譜列表</h1>
          <RecipeDisplay />
        </div>
      </Wrapper>
    </div>
  );
};
export default Recipes;
