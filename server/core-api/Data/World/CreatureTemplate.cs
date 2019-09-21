﻿using System;
using System.Collections.Generic;

namespace server.Data.World
{
    public partial class CreatureTemplate
    {
        public int Entry { get; set; }
        public int DifficultyEntry1 { get; set; }
        public int DifficultyEntry2 { get; set; }
        public int DifficultyEntry3 { get; set; }
        public int KillCredit1 { get; set; }
        public int KillCredit2 { get; set; }
        public int Modelid1 { get; set; }
        public int Modelid2 { get; set; }
        public int Modelid3 { get; set; }
        public int Modelid4 { get; set; }
        public string Name { get; set; }
        public string Subname { get; set; }
        public string IconName { get; set; }
        public int GossipMenuId { get; set; }
        public byte Minlevel { get; set; }
        public byte Maxlevel { get; set; }
        public short Exp { get; set; }
        public short Faction { get; set; }
        public int Npcflag { get; set; }
        public float SpeedWalk { get; set; }
        public float SpeedRun { get; set; }
        public float Scale { get; set; }
        public byte Rank { get; set; }
        public byte Dmgschool { get; set; }
        public int BaseAttackTime { get; set; }
        public int RangeAttackTime { get; set; }
        public float BaseVariance { get; set; }
        public float RangeVariance { get; set; }
        public byte UnitClass { get; set; }
        public int UnitFlags { get; set; }
        public int UnitFlags2 { get; set; }
        public int Dynamicflags { get; set; }
        public byte Family { get; set; }
        public byte Type { get; set; }
        public int TypeFlags { get; set; }
        public int Lootid { get; set; }
        public int Pickpocketloot { get; set; }
        public int Skinloot { get; set; }
        public int PetSpellDataId { get; set; }
        public int VehicleId { get; set; }
        public int Mingold { get; set; }
        public int Maxgold { get; set; }
        public string Ainame { get; set; }
        public byte MovementType { get; set; }
        public float HoverHeight { get; set; }
        public float HealthModifier { get; set; }
        public float ManaModifier { get; set; }
        public float ArmorModifier { get; set; }
        public float DamageModifier { get; set; }
        public float ExperienceModifier { get; set; }
        public byte RacialLeader { get; set; }
        public int MovementId { get; set; }
        public byte RegenHealth { get; set; }
        public int MechanicImmuneMask { get; set; }
        public int SpellSchoolImmuneMask { get; set; }
        public int FlagsExtra { get; set; }
        public string ScriptName { get; set; }
        public short? VerifiedBuild { get; set; }
    }
}
