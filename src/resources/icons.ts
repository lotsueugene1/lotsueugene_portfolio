import { IconType } from "react-icons";

import {
  HiOutlineLink,
  HiEnvelope,
  HiCalendarDays,
  HiOutlineGlobeAsiaAustralia,
  HiOutlinePhone,
} from "react-icons/hi2";

import { PiUserCircleDuotone, PiGridFourDuotone, PiImageDuotone } from "react-icons/pi";

import {
  SiJavascript,
  SiNextdotjs,
  SiPython,
  SiTypescript,
  SiPostgresql,
  SiPytorch,
  SiDocker,
} from "react-icons/si";

import { FaGithub, FaLinkedin } from "react-icons/fa6";

export const iconLibrary: Record<string, IconType> = {
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  gallery: PiImageDuotone,
  github: FaGithub,
  linkedin: FaLinkedin,
  phone: HiOutlinePhone,
  javascript: SiJavascript,
  nextjs: SiNextdotjs,
  python: SiPython,
  typescript: SiTypescript,
  postgresql: SiPostgresql,
  pytorch: SiPytorch,
  docker: SiDocker,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
