export const svgPath = {
  list: (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <g fill="currentColor" fillRule="evenodd">
        <rect x="10" y="15" width="8" height="2" rx="1" />
        <rect x="6" y="15" width="2" height="2" rx="1" />
        <rect x="10" y="11" width="8" height="2" rx="1" />
        <rect x="6" y="11" width="2" height="2" rx="1" />
        <rect x="10" y="7" width="8" height="2" rx="1" />
        <rect x="6" y="7" width="2" height="2" rx="1" />
      </g>
    </svg>
  ),
  board: (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <g fill="currentColor">
        <path d="M4 18h16.008C20 18 20 6 20 6H3.992C4 6 4 18 4 18zM2 5.994C2 4.893 2.898 4 3.99 4h16.02C21.108 4 22 4.895 22 5.994v12.012A1.997 1.997 0 0120.01 20H3.99A1.994 1.994 0 012 18.006V5.994z" />
        <path d="M8 6v12h2V6zm6 0v12h2V6z" />
      </g>
    </svg>
  ),
  backlog: (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <g fill="currentColor">
        <path d="M5 19.002C5 19 17 19 17 19v-2.002C17 17 5 17 5 17v2.002zm-2-2.004C3 15.894 3.895 15 4.994 15h12.012c1.101 0 1.994.898 1.994 1.998v2.004A1.997 1.997 0 0117.006 21H4.994A1.998 1.998 0 013 19.002v-2.004z" />
        <path d="M5 15h12v-2H5v2zm-2-4h16v6H3v-6z" />
        <path d="M7 11.002C7 11 19 11 19 11V8.998C19 9 7 9 7 9v2.002zM5 8.998C5 7.894 5.895 7 6.994 7h12.012C20.107 7 21 7.898 21 8.998v2.004A1.997 1.997 0 0119.006 13H6.994A1.998 1.998 0 015 11.002V8.998z" />
        <path d="M5 5v2h12V5H5zm-2-.002C3 3.894 3.895 3 4.994 3h12.012C18.107 3 19 3.898 19 4.998V9H3V4.998z" />
      </g>
    </svg>
  ),
  plus: (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13 11V3.993A.997.997 0 0 0 12 3c-.556 0-1 .445-1 .993V11H3.993A.997.997 0 0 0 3 12c0 .557.445 1 .993 1H11v7.007c0 .548.448.993 1 .993.556 0 1-.445 1-.993V13h7.007A.997.997 0 0 0 21 12c0-.556-.445-1-.993-1z"
      />
    </svg>
  ),
  threedot: (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <g fill="currentColor" fillRule="evenodd">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </g>
    </svg>
  ),
};

export default function Icon({ name }: { name: keyof typeof svgPath }) {
  return svgPath[name];
}
