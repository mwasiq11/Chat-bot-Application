import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <Container>
      <StyledWrapper>
        <svg viewBox="0 0 240 240" height={40} width={40} className="pl">
          <circle
            strokeLinecap="round"
            strokeDashoffset={-330}
            strokeDasharray="0 660"
            strokeWidth={12} // Increased from 8 to 12
            stroke="#000"
            fill="none"
            r={105}
            cy={120}
            cx={120}
            className="pl__ring pl__ring--a"
          />
          <circle
            strokeLinecap="round"
            strokeDashoffset={-110}
            strokeDasharray="0 220"
            strokeWidth={12} // Increased
            stroke="#7e7e7e"
            fill="none"
            r={35}
            cy={120}
            cx={120}
            className="pl__ring pl__ring--b"
          />
          <circle
            strokeLinecap="round"
            strokeDasharray="0 440"
            strokeWidth={12} // Increased
            stroke="#686868"
            fill="none"
            r={70}
            cy={120}
            cx={85}
            className="pl__ring pl__ring--c"
          />
          <circle
            strokeLinecap="round"
            strokeDasharray="0 440"
            strokeWidth={12} // Increased
            stroke="#000"
            fill="none"
            r={70}
            cy={120}
            cx={155}
            className="pl__ring pl__ring--d"
          />
        </svg>
      </StyledWrapper>
      <span className="loading-text"></span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #333;
`;

const StyledWrapper = styled.div`
  .pl {
    width: 2em;
    height: 2em;
  }

  .pl__ring {
    animation: ringA 2s linear infinite;
  }

  .pl__ring--a {
    stroke: #000000;
  }

  .pl__ring--b {
    animation-name: ringB;
    stroke: #7e7e7e;
  }

  .pl__ring--c {
    animation-name: ringC;
    stroke: #686868;
  }

  .pl__ring--d {
    animation-name: ringD;
    stroke: #000000;
  }

  @keyframes ringA {
    from,
    4% {
      stroke-dasharray: 0 660;
      stroke-width: 12;
      stroke-dashoffset: -330;
    }
    12% {
      stroke-dasharray: 60 600;
      stroke-width: 14;
      stroke-dashoffset: -335;
    }
    32% {
      stroke-dasharray: 60 600;
      stroke-width: 14;
      stroke-dashoffset: -595;
    }
    40%,
    54% {
      stroke-dasharray: 0 660;
      stroke-width: 12;
      stroke-dashoffset: -660;
    }
    62% {
      stroke-dasharray: 60 600;
      stroke-width: 14;
      stroke-dashoffset: -665;
    }
    82% {
      stroke-dasharray: 60 600;
      stroke-width: 14;
      stroke-dashoffset: -925;
    }
    90%,
    to {
      stroke-dasharray: 0 660;
      stroke-width: 12;
      stroke-dashoffset: -990;
    }
  }
  @keyframes ringB {
    from,
    12% {
      stroke-dasharray: 0 220;
      stroke-width: 12;
      stroke-dashoffset: -110;
    }
    20% {
      stroke-dasharray: 20 200;
      stroke-width: 14;
      stroke-dashoffset: -115;
    }
    40% {
      stroke-dasharray: 20 200;
      stroke-width: 14;
      stroke-dashoffset: -195;
    }
    48%,
    62% {
      stroke-dasharray: 0 220;
      stroke-width: 12;
      stroke-dashoffset: -220;
    }
    70% {
      stroke-dasharray: 20 200;
      stroke-width: 14;
      stroke-dashoffset: -225;
    }
    90% {
      stroke-dasharray: 20 200;
      stroke-width: 14;
      stroke-dashoffset: -305;
    }
    98%,
    to {
      stroke-dasharray: 0 220;
      stroke-width: 12;
      stroke-dashoffset: -330;
    }
  }
  @keyframes ringC {
    from {
      stroke-dasharray: 0 440;
      stroke-width: 12;
      stroke-dashoffset: 0;
    }
    8% {
      stroke-dasharray: 40 400;
      stroke-width: 14;
      stroke-dashoffset: -5;
    }
    28% {
      stroke-dasharray: 40 400;
      stroke-width: 14;
      stroke-dashoffset: -175;
    }
    36%,
    58% {
      stroke-dasharray: 0 440;
      stroke-width: 12;
      stroke-dashoffset: -220;
    }
    66% {
      stroke-dasharray: 40 400;
      stroke-width: 14;
      stroke-dashoffset: -225;
    }
    86% {
      stroke-dasharray: 40 400;
      stroke-width: 14;
      stroke-dashoffset: -395;
    }
    94%,
    to {
      stroke-dasharray: 0 440;
      stroke-width: 12;
      stroke-dashoffset: -440;
    }
  }
  @keyframes ringD {
    from,
    8% {
      stroke-dasharray: 0 440;
      stroke-width: 12;
      stroke-dashoffset: 0;
    }
    16% {
      stroke-dasharray: 40 400;
      stroke-width: 14;
      stroke-dashoffset: -5;
    }
    36% {
      stroke-dasharray: 40 400;
      stroke-width: 14;
      stroke-dashoffset: -175;
    }
    44%,
    50% {
      stroke-dasharray: 0 440;
      stroke-width: 12;
      stroke-dashoffset: -220;
    }
    58% {
      stroke-dasharray: 40 400;
      stroke-width: 14;
      stroke-dashoffset: -225;
    }
    78% {
      stroke-dasharray: 40 400;
      stroke-width: 14;
      stroke-dashoffset: -395;
    }
    86%,
    to {
      stroke-dasharray: 0 440;
      stroke-width: 12;
      stroke-dashoffset: -440;
    }
  }
`;

export default Loader;
