import { useParams } from "react-router-dom";
import { useFetchIdea } from "../../hooks/useFetchIdea";
import { IdeaDetails } from "../../components/IdeaDetail";

export const InvestorIdeaDetail = () => {
  const { id } = useParams();
  const { idea, loading, error } = useFetchIdea(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <IdeaDetails idea={idea} role="investor" />;
};
