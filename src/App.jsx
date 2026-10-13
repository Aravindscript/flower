import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "./style.css";

const flowers = [
  {
    id: "left",
    x: 205,
    y: 425,
    color: "#45efff",
    stem: "#9b75ff",
    size: 0.95,
  },
  {
    id: "leftMiddle",
    x: 330,
    y: 345,
    color: "#55f4ff",
    stem: "#bd78ff",
    size: 1.05,
  },
  {
    id: "center",
    x: 500,
    y: 270,
    color: "#65f6ff",
    stem: "#8e72ff",
    size: 1.12,
  },
  {
    id: "rightMiddle",
    x: 670,
    y: 345,
    color: "#51efff",
    stem: "#ff648e",
    size: 1.05,
  },
  {
    id: "right",
    x: 795,
    y: 425,
    color: "#49efff",
    stem: "#ff547e",
    size: 0.95,
  },
];

const petals = Array.from({ length: 8 }, (_, i) => i * 45);

function Flower({ flower }) {
  const { id, x, y, color, size } = flower;

  return (
    <g
      id={`flower-${id}`}
      transform={`translate(${x} ${y}) scale(${size})`}
      className="flower-bloom"
    >
      <circle
        className="flower-halo"
        r="58"
        fill={color}
        opacity="0.2"
        filter="url(#largeGlow)"
      />

      {petals.map((angle, i) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <ellipse
            cx="0"
            cy="-28"
            rx={i % 2 === 0 ? 10 : 8}
            ry={i % 2 === 0 ? 30 : 25}
            fill={`url(#petalGradient-${id})`}
            stroke="#8ffaff"
            strokeWidth="1.3"
            opacity="0.92"
            filter="url(#petalGlow)"
          />

          <ellipse
            cx="0"
            cy="-27"
            rx="2.4"
            ry="19"
            fill="#ffffff"
            opacity="0.58"
          />
        </g>
      ))}

      <circle r="8" fill="#d5ffff" filter="url(#petalGlow)" />
      <circle r="3.5" fill="#ffffff" />

      {Array.from({ length: 5 }, (_, i) => (
        <g
          key={i}
          transform={`rotate(${i * 72 + 15}) translate(0 -43)`}
        >
          <path
            d="M 0 0 Q -5 -17 0 -29 Q 5 -17 0 0"
            fill="#b9ffff"
            stroke="#66edff"
            strokeWidth="1"
            filter="url(#petalGlow)"
          />

          <path
            d="M 0 -3 L 0 -24"
            stroke="#ffffff"
            strokeWidth="1.2"
            opacity="0.8"
          />
        </g>
      ))}
    </g>
  );
}

export default function App() {
  const sceneRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.5 });

      const stemPaths = gsap.utils.toArray(".stem-main");
      const glowPaths = gsap.utils.toArray(".stem-glow");
      const flowerGroups = gsap.utils.toArray(".flower-bloom");
      const halos = gsap.utils.toArray(".flower-halo");
      const grass = gsap.utils.toArray(".grass-blade");

      // Initial stem drawing state
      gsap.set(stemPaths, {
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
      });

      gsap.set(glowPaths, {
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        opacity: 0,
      });

      gsap.set(flowerGroups, {
        scale: 0,
        transformOrigin: "center center",
      });

      gsap.set(halos, { opacity: 0 });

      gsap.set(".small-buds", {
        opacity: 0,
        scale: 0.2,
        transformOrigin: "center center",
      });

      // 1. Grow the five stems
      timeline.to(stemPaths, {
        strokeDashoffset: 0,
        duration: 1.8,
        stagger: 0.16,
        ease: "power2.out",
      });

      // 2. Bloom the flowers
      timeline.to(
        flowerGroups,
        {
          scale: (index) => flowers[index].size,
          duration: 0.85,
          stagger: 0.23,
          ease: "elastic.out(1, 0.55)",
        },
        "-=0.35"
      );

      // 3. Flower glow
      timeline.to(
        halos,
        {
          opacity: 0.95,
          duration: 0.7,
          stagger: 0.2,
          ease: "sine.out",
        },
        "<"
      );

      // 4. Decorative buds appear
      timeline.to(
        ".small-buds",
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );

      // 5. Travelling light through the stems
      timeline.to(glowPaths, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.85,
        stagger: 0.32,
        ease: "power1.inOut",
      });

      flowers.forEach((flower, index) => {
        timeline.to(
          `#flower-${flower.id}`,
          {
            filter: "url(#flowerStrongGlow)",
            duration: 0.25,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          `-=${Math.max(0.05, 0.85 - index * 0.12)}`
        );
      });

      // 6. Keep a soft stem glow
      timeline.to(
        glowPaths,
        {
          opacity: 0.2,
          duration: 1.1,
          ease: "sine.inOut",
        },
        "+=0.15"
      );

      timeline.to(
        halos,
        {
          opacity: 0.72,
          duration: 1.2,
          ease: "sine.inOut",
        },
        "<"
      );

      // 7. Gentle flower and grass movement
      timeline.add(() => {
        flowerGroups.forEach((flower, index) => {
          gsap.to(flower, {
            rotation: index % 2 === 0 ? 2.2 : -2.2,
            duration: 1.7 + index * 0.12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "50% 100%",
          });
        });

        gsap.to(grass, {
          rotation: (index) => (index % 2 === 0 ? 3 : -3),
          duration: 1.8,
          stagger: 0.06,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "50% 100%",
        });

        gsap.to(".flower-halo", {
          opacity: 0.95,
          duration: 1.4,
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="flower-scene" ref={sceneRef}>
      {/* Moving star background */}
      <div className="stars-layer">
        {Array.from({ length: 400 }, (_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 61 + 7) % 100}vh`,
              animationDelay: `${-(i % 14) * 0.8}s, ${-(i % 14) * 1.1}s`,
              animationDuration: `${2 + (i % 5) * 0.45}s, ${
                11 + (i % 7) * 1.2
              }s`,
              width: `${i % 7 === 0 ? 3 : 1.5}px`,
              height: `${i % 7 === 0 ? 3 : 1.5}px`,
            }}
          />
        ))}
      </div>

      <svg
        className="flower-svg"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Five glowing flowers growing and gently swaying"
      >
        <defs>
          <filter
            id="petalGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="largeGlow"
            x="-150%"
            y="-150%"
            width="400%"
            height="400%"
          >
            <feGaussianBlur stdDeviation="15" />
          </filter>

          <filter
            id="flowerStrongGlow"
            x="-150%"
            y="-150%"
            width="400%"
            height="400%"
          >
            <feGaussianBlur stdDeviation="7" result="blur" />

            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1.5 0"
              result="strongBlur"
            />

            <feMerge>
              <feMergeNode in="strongBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {flowers.map((flower) => (
            <linearGradient
              key={flower.id}
              id={`petalGradient-${flower.id}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop
                offset="35%"
                stopColor={flower.color}
                stopOpacity="0.9"
              />
              <stop offset="100%" stopColor="#6d7dff" stopOpacity="0.2" />
            </linearGradient>
          ))}

          <linearGradient
            id="grassGradient"
            x1="0"
            y1="1"
            x2="0.7"
            y2="0"
          >
            <stop offset="0%" stopColor="#07552c" />
            <stop offset="45%" stopColor="#20c958" />
            <stop offset="75%" stopColor="#43f276" />
            <stop offset="100%" stopColor="#bdff96" />
          </linearGradient>
        </defs>

        {/* Background ground glow */}
        <ellipse
          cx="500"
          cy="735"
          rx="250"
          ry="35"
          fill="#00eaff"
          opacity="0.08"
          filter="url(#largeGlow)"
        />

        {/* Denser, longer green grass */}
        {Array.from({ length: 29 }, (_, i) => {
          const x = 500 + (i - 14) * 12;
          const endX = x + (i - 14) * 14;
          const endY = 470 + (Math.abs(i - 14) % 5) * 30;

          return (
            <path
              key={i}
              className="grass-blade"
              d={`M 500 730 Q ${x} 640 ${endX} ${endY}`}
              fill="none"
              stroke="url(#grassGradient)"
              strokeWidth={i % 3 === 0 ? 6 : 4}
              strokeLinecap="round"
              opacity={0.72 + (i % 4) * 0.07}
            />
          );
        })}

        {/* Five thicker stems from one common base */}
        {flowers.map((flower) => {
          const controlX = (500 + flower.x) / 2;
          const controlY = (720 + flower.y) / 2;

          const stemD = `M 500 720 Q ${controlX} ${
            controlY + 30
          } ${flower.x} ${flower.y + 28}`;

          return (
            <g key={flower.id} className={`plant plant-${flower.id}`}>
              {/* Main coloured stem */}
              <path
                className="stem-main"
                d={stemD}
                fill="none"
                stroke={flower.stem}
                strokeWidth={14}
                strokeLinecap="round"
              />

              {/* Travelling cyan glow */}
              <path
                className="stem-glow"
                d={stemD}
                fill="none"
                stroke="#b9ffff"
                strokeWidth="12"
                strokeLinecap="round"
                filter="url(#petalGlow)"
                opacity="0"
              />

              <Flower flower={flower} />
            </g>
          );
        })}

        {/* More decorative buds around the base */}
        <g className="small-buds">
          {Array.from({ length: 12 }, (_, i) => {
            const side = i < 6 ? -1 : 1;
            const n = i % 6;

            return (
              <g
                key={i}
                transform={`translate(${
                  500 + side * (70 + n * 19)
                } ${685 - n * 13}) rotate(${side * (30 + n * 7)})`}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx="7"
                  ry="11"
                  fill={side < 0 ? "#65edff" : "#ff75b9"}
                  fillOpacity="0.2"
                  stroke={side < 0 ? "#62efff" : "#ff77c5"}
                  strokeWidth="2"
                  filter="url(#petalGlow)"
                />

                <ellipse
                  cx="0"
                  cy="0"
                  rx="2.5"
                  ry="5"
                  fill="#ffffff"
                  opacity="0.7"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </main>
  );
}