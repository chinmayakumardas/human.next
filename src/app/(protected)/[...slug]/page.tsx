

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center  px-4">
      {/* Computer Icon */}
      <svg
        width="130"
        height="130"
        viewBox="0 0 130 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Monitor */}
        <rect
          x="18"
          y="12"
          width="94"
          height="82"
          rx="4"
          stroke="#666"
          strokeWidth="1.5"
          fill="#F8F8F8"
        />

        {/* Screen */}
        <rect
          x="29"
          y="22"
          width="72"
          height="54"
          rx="4"
          stroke="#666"
          strokeWidth="1.2"
          fill="#FFF"
        />

        {/* Dots */}
        {[
          [38, 33],[46, 33],[54, 33],[62, 33],[70, 33],[78, 33],
          [38, 41],[46, 41],[54, 41],[62, 41],[70, 41],
          [38, 49],[46, 49],[54, 49],
          [38, 57],[46, 57],[54, 57],[62, 57]
        ].map(([x, y], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="3"
            height="5"
            rx="1"
            fill="#444"
          />
        ))}

        {/* X */}
        <path
          d="M74 48L84 58M84 48L74 58"
          stroke="#444"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Bottom bezel */}
        <rect x="28" y="102" width="10" height="3" fill="#555" />
        <rect x="78" y="98" width="16" height="3" fill="#555" />

        {/* Stand */}
        <rect x="46" y="95" width="38" height="6" fill="#DDD" stroke="#666" />
        <line x1="50" y1="95" x2="50" y2="101" stroke="#888" />
        <line x1="54" y1="95" x2="54" y2="101" stroke="#888" />
        <line x1="58" y1="95" x2="58" y2="101" stroke="#888" />
      </svg>

      <h1 className="mt-4 text-[15px] font-normal text-[#333]">
        Not found
      </h1>

      <p className="mt-2 text-[12px] text-[#555]">
        We could not find the page you were looking for
      </p>
    </main>
  );
}