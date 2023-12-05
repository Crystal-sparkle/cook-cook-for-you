import styled from "styled-components";
import RecipeDisplay from "./RecipeDisplay";
import RecipeForm from "./RecipeForm";

const Wrapper = styled.div`
  margin: 40px;
  padding: 20px;
  border-radius: 20px;
`;

const Recipes: React.FC = () => {
  const happyCodring = "happy coding, happy day";

  return (
    <Wrapper>
      <h2>{happyCodring}</h2>
      <RecipeForm />
      <RecipeDisplay />
    </Wrapper>
  );
};
export default Recipes;
