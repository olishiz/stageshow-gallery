import type { ComponentType } from "react";
import AiAnswer from "./ai-answer";
import BoardDrag from "./board-drag";
import CommandMenu from "./command-menu";
import CopyCommand from "./copy-command";
import EdgeRuledBento from "./edge-ruled-bento";
import HoldToConfirm from "./hold-to-confirm";
import HoloPass from "./holo-pass";
import LaunchBento from "./launch-bento";
import LikeBurst from "./like-burst";
import PayoutFlow from "./payout-flow";
import PricingCard from "./pricing-card";
import ProfileBento from "./profile-bento";
import ProfileCard from "./profile-card";
import SlidingTabs from "./sliding-tabs";
import SplitHero from "./split-hero";
import StatusHero from "./status-hero";

export const SHOWCASE_COMPONENTS: Record<string, ComponentType> = {
  "launch-bento": LaunchBento,
  "edge-ruled-bento": EdgeRuledBento,
  "profile-bento": ProfileBento,
  "ai-answer": AiAnswer,
  "payout-flow": PayoutFlow,
  "board-drag": BoardDrag,
  "command-menu": CommandMenu,
  "pricing-card": PricingCard,
  "profile-card": ProfileCard,
  "holo-pass": HoloPass,
  "split-hero": SplitHero,
  "status-hero": StatusHero,
  "copy-command": CopyCommand,
  "like-burst": LikeBurst,
  "hold-to-confirm": HoldToConfirm,
  "sliding-tabs": SlidingTabs,
};
