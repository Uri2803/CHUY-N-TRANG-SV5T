import { useEffect, useState } from "react";
import submissionApi from "../../../../api/Achievement/submissionApi";
import { CSpinner } from "@coreui/react";

const CompareEvidence = (props: any) => {
  const { examerId, achievementId, fileName, selfComment } = props;
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getCompare = async () => {
      try {
        setIsLoading(true);
        const fileResult = await submissionApi.compareEvidence(
          examerId,
          achievementId,
          fileName,
          selfComment
        );
        if (fileResult === "True") {
          setResult("Hợp lệ");
        } else {
          setResult("Không hợp lệ");
        }
        setIsLoading(false);
      } catch (error: any) {
        console.log(error.message);
        setResult("Có lỗi xảy ra");
        setIsLoading(false);
      }
    };
    getCompare();
  }, [achievementId, examerId, fileName, selfComment]);
  if (isLoading)
    return (
      <div className="Spinner">
        <CSpinner
          className="elementSpinner"
          color="info"
          style={{
            width: "1rem",
            height: "1rem",
          }}
        />
      </div>
    );
  return (
    <div className="btn px-0 d-flex align-items-center">
      Minh chứng: {result}
    </div>
  );
};

export default CompareEvidence;
