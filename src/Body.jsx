import { useState } from "react";

import HeroDisplayer from "./components/HeroDisplayer";
import AyahDisplayer from "./components/AyahDisplayer";

function Body() {
  const [testStarted, setTestStarted] = useState(false);
  return (
    <section className="flex justify-center items-center w-full flex-col flex-1 md:min-h-[80vh] min-h-[75vh]">
      <div className="flex-1 flex items-center justify-center md:p-8 p-1 pt-2">
        {!testStarted ? (
          <HeroDisplayer setTestStarted={setTestStarted} />
        ) : (
          <AyahDisplayer />
        )}
      </div>
    </section>
  );
}

export default Body;
