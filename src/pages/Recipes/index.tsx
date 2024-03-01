import RecipeDisplay from "./RecipeDisplay";
import RecipeForm from "./RecipeForm";
import { BannerImg, RecipeFormWrapper, Title, Wrapper } from "./recipes.style";

const Recipes: React.FC = () => {
  return (
    <div>
      <BannerImg>
        <RecipeFormWrapper>
          <RecipeForm />
        </RecipeFormWrapper>
      </BannerImg>
      <Wrapper>
        <div>
          <Title>食譜列表</Title>
          <RecipeDisplay />
        </div>
      </Wrapper>
    </div>
  );
};
export default Recipes;
