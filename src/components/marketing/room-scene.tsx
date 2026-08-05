type Variant = "antes" | "depois";

const PALETTES = {
  antes: {
    id: "a",
    ceiling: ["#5E6367", "#4E5357"],
    wall: ["#71767A", "#5A5F63"],
    floor: ["#5E5A55", "#4A4744"],
    plank: "#000000",
    plankOpacity: 0.1,
    sky: ["#C3CACE", "#AFB7BC"],
    frame: "#494D50",
    headboard: ["#585C60", "#474A4D"],
    mattress: ["#95999C", "#7F8386"],
    blanket: ["#6E7276", "#5C6064"],
    pillow: ["#A6AAAC", "#8E9295"],
    table: "#55585B",
    lampShade: ["#8E9295", "#767A7D"],
    lampGlow: 0,
    pot: "#5A5E60",
    leaf: ["#5B6A5E", "#4A574D"],
    art: ["#787D80", "#616568"],
    shaft: 0,
    rug: ["#63676A", "#54585B"],
    vignette: 0.5,
  },
  depois: {
    id: "d",
    ceiling: ["#3B3128", "#2C241D"],
    wall: ["#C9A87E", "#8C6B4A"],
    floor: ["#96603A", "#5E3A22"],
    plank: "#2A1710",
    plankOpacity: 0.28,
    sky: ["#FFE3B0", "#FFB963"],
    frame: "#2E2119",
    headboard: ["#5C3D28", "#3D281A"],
    mattress: ["#F6EADA", "#DCC7AC"],
    blanket: ["#C08248", "#8A5730"],
    pillow: ["#FFF8EC", "#E8D6BE"],
    table: "#4A3123",
    lampShade: ["#FFDFA8", "#E9B266"],
    lampGlow: 1,
    pot: "#7A4B2E",
    leaf: ["#5C8A55", "#3B6039"],
    art: ["#8A6440", "#513723"],
    shaft: 1,
    rug: ["#B08A5E", "#7C5C3A"],
    vignette: 0.32,
  },
} as const;

/**
 * Interior renderizado em SVG, em dois tratamentos de luz.
 * "antes": luz chapada, cor dessaturada, quarto sem cuidado.
 * "depois": luz de fim de tarde entrando pela janela.
 * A diferença entre os dois É o produto.
 */
export function RoomScene({ variant }: { variant: Variant }) {
  const p = PALETTES[variant];
  const u = (n: string) => `${n}-${p.id}`;

  return (
    <svg
      viewBox="0 0 900 600"
      className="size-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={u("ceil")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.ceiling[0]} />
          <stop offset="100%" stopColor={p.ceiling[1]} />
        </linearGradient>
        <linearGradient id={u("wall")} x1="0.1" y1="0" x2="0.95" y2="0.9">
          <stop offset="0%" stopColor={p.wall[0]} />
          <stop offset="100%" stopColor={p.wall[1]} />
        </linearGradient>
        <linearGradient id={u("floor")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={p.floor[0]} />
          <stop offset="100%" stopColor={p.floor[1]} />
        </linearGradient>
        <linearGradient id={u("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="100%" stopColor={p.sky[1]} />
        </linearGradient>
        <linearGradient id={u("hb")} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={p.headboard[0]} />
          <stop offset="100%" stopColor={p.headboard[1]} />
        </linearGradient>
        <linearGradient id={u("mat")} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={p.mattress[0]} />
          <stop offset="100%" stopColor={p.mattress[1]} />
        </linearGradient>
        <linearGradient id={u("bl")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={p.blanket[0]} />
          <stop offset="100%" stopColor={p.blanket[1]} />
        </linearGradient>
        <linearGradient id={u("pil")} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={p.pillow[0]} />
          <stop offset="100%" stopColor={p.pillow[1]} />
        </linearGradient>
        <linearGradient id={u("shade")} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={p.lampShade[0]} />
          <stop offset="100%" stopColor={p.lampShade[1]} />
        </linearGradient>
        <linearGradient id={u("leaf")} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={p.leaf[0]} />
          <stop offset="100%" stopColor={p.leaf[1]} />
        </linearGradient>
        <linearGradient id={u("art")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.art[0]} />
          <stop offset="100%" stopColor={p.art[1]} />
        </linearGradient>
        <linearGradient id={u("rug")} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={p.rug[0]} />
          <stop offset="100%" stopColor={p.rug[1]} />
        </linearGradient>

        <linearGradient id={u("shaft")} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FFD79B" stopOpacity="0.62" />
          <stop offset="60%" stopColor="#FFC170" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFB55C" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={u("lampglow")}>
          <stop offset="0%" stopColor="#FFCE84" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFB259" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={u("vig")} cx="0.5" cy="0.45" r="0.78">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity={p.vignette} />
        </radialGradient>

        <filter id={u("soft")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id={u("softer")} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
      </defs>

      {/* estrutura do quarto */}
      <rect width="900" height="86" fill={`url(#${u("ceil")})`} />
      <rect y="86" width="900" height="352" fill={`url(#${u("wall")})`} />
      <rect y="438" width="900" height="162" fill={`url(#${u("floor")})`} />

      {/* tábuas do piso em perspectiva */}
      <g stroke={p.plank} strokeOpacity={p.plankOpacity} strokeWidth="2">
        <path d="M0 470h900M0 508h900M0 552h900" />
        <path d="M120 438 40 600M340 438 300 600M560 438 600 600M780 438 860 600" />
      </g>
      <rect y="432" width="900" height="8" fill="#000" opacity="0.16" />

      {/* janela */}
      <g>
        <rect
          x="52"
          y="104"
          width="212"
          height="290"
          rx="6"
          fill={p.frame}
          opacity="0.95"
        />
        <rect
          x="64"
          y="116"
          width="188"
          height="266"
          rx="3"
          fill={`url(#${u("sky")})`}
        />
        {/* colinas ao fundo, só perceptíveis no "depois" */}
        <path
          d="M64 320c34-26 58-8 88-24s58-26 100-4v90H64z"
          fill="#000"
          opacity={p.shaft ? 0.16 : 0.07}
        />
        <rect x="152" y="116" width="8" height="266" fill={p.frame} />
        <rect x="64" y="242" width="188" height="8" fill={p.frame} />
      </g>

      {/* feixe de luz — existe apenas no "depois" */}
      {p.shaft === 1 && (
        <>
          <path
            d="M64 130 252 130 690 600 236 600Z"
            fill={`url(#${u("shaft")})`}
            filter={`url(#${u("soft")})`}
          />
          <ellipse
            cx="330"
            cy="540"
            rx="230"
            ry="62"
            fill="#FFD79B"
            opacity="0.2"
            filter={`url(#${u("softer")})`}
          />
        </>
      )}

      {/* tapete */}
      <path
        d="M232 512 700 512 760 596 176 596Z"
        fill={`url(#${u("rug")})`}
        opacity="0.9"
      />

      {/* quadro na parede */}
      <g transform={p.shaft ? "rotate(0 552 190)" : "rotate(-2.4 552 190)"}>
        <rect
          x="472"
          y="132"
          width="160"
          height="116"
          rx="4"
          fill={p.frame}
          opacity="0.9"
        />
        <rect
          x="482"
          y="142"
          width="140"
          height="96"
          rx="2"
          fill={`url(#${u("art")})`}
        />
      </g>

      {/* cama */}
      <g>
        {/* sombra sob a cama */}
        <ellipse
          cx="500"
          cy="524"
          rx="230"
          ry="26"
          fill="#000"
          opacity="0.28"
          filter={`url(#${u("soft")})`}
        />
        {/* cabeceira */}
        <rect
          x="336"
          y="252"
          width="330"
          height="122"
          rx="14"
          fill={`url(#${u("hb")})`}
        />
        {/* colchão */}
        <path
          d="M300 372h404a16 16 0 0 1 16 16v66H284v-66a16 16 0 0 1 16-16Z"
          fill={`url(#${u("mat")})`}
        />
        {/* manta dobrada no pé */}
        <path
          d="M284 424h436v30a16 16 0 0 1-16 16H300a16 16 0 0 1-16-16v-30Z"
          fill={`url(#${u("bl")})`}
        />
        {/* travesseiros */}
        <rect
          x="330"
          y="326"
          width="152"
          height="58"
          rx="18"
          fill={`url(#${u("pil")})`}
        />
        <rect
          x="500"
          y="326"
          width="152"
          height="58"
          rx="18"
          fill={`url(#${u("pil")})`}
        />
        {/* almofada extra — quarto arrumado só no "depois" */}
        {p.shaft === 1 && (
          <rect
            x="438"
            y="348"
            width="96"
            height="44"
            rx="12"
            fill={p.blanket[0]}
            opacity="0.95"
          />
        )}
        {/* pés */}
        <rect x="298" y="454" width="18" height="26" rx="4" fill={p.table} />
        <rect x="688" y="454" width="18" height="26" rx="4" fill={p.table} />
      </g>

      {/* criado-mudo + luminária */}
      <g>
        <rect x="736" y="392" width="112" height="94" rx="8" fill={p.table} />
        <rect
          x="748"
          y="416"
          width="88"
          height="4"
          rx="2"
          fill="#000"
          opacity="0.2"
        />
        {p.lampGlow === 1 && (
          <circle
            cx="792"
            cy="344"
            r="120"
            fill={`url(#${u("lampglow")})`}
            filter={`url(#${u("soft")})`}
          />
        )}
        <rect x="788" y="330" width="8" height="62" fill={p.table} />
        <path
          d="M760 300h64l14 34h-92l14-34Z"
          fill={`url(#${u("shade")})`}
        />
      </g>

      {/* planta */}
      <g>
        <path
          d="M92 470h72l-10 74H102l-10-74Z"
          fill={p.pot}
        />
        <g fill={`url(#${u("leaf")})`}>
          <path d="M128 470c-4-46-30-70-58-80 22 44 30 62 58 80Z" />
          <path d="M128 470c4-52 32-74 62-84-24 46-34 66-62 84Z" />
          <path d="M128 470c-2-40 8-72 26-92-6 44-8 66-26 92Z" />
          {p.shaft === 1 && (
            <path d="M128 470c-16-32-14-62-6-86-12 40-6 60 6 86Z" />
          )}
        </g>
      </g>

      {/* rodapé */}
      <rect y="426" width="900" height="12" fill="#000" opacity="0.14" />

      {/* vinheta */}
      <rect width="900" height="600" fill={`url(#${u("vig")})`} />

      {/* dominante fria no "antes" — o cinza de foto de celular com flash */}
      {p.shaft === 0 && (
        <rect
          width="900"
          height="600"
          fill="#8FA4B4"
          opacity="0.16"
          style={{ mixBlendMode: "color" }}
        />
      )}
    </svg>
  );
}
