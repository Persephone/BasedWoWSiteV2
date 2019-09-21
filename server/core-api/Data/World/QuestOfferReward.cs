﻿using System;
using System.Collections.Generic;

namespace server.Data.World
{
    public partial class QuestOfferReward
    {
        public int Id { get; set; }
        public short Emote1 { get; set; }
        public short Emote2 { get; set; }
        public short Emote3 { get; set; }
        public short Emote4 { get; set; }
        public int EmoteDelay1 { get; set; }
        public int EmoteDelay2 { get; set; }
        public int EmoteDelay3 { get; set; }
        public int EmoteDelay4 { get; set; }
        public string RewardText { get; set; }
        public short VerifiedBuild { get; set; }
    }
}
