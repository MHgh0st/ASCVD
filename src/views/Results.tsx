import { AscvdResult } from "@/types/types";
export default function Results(props: { results: AscvdResult | undefined }) {
  return (
    <>
      <div>Risk: {props.results?.final_risk}</div>
      <div>Risk Category: {props.results?.risk_category}</div>
    </>
  );
}
