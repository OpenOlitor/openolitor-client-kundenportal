export interface Abo {
  id: number;
  abotypId: number;
  abotypName: string;
  depotName?: string;
  tourName?: string;
  vertrieb: {
    beschrieb?: string;
    liefertag?: string;
  };
  abotyp: {
    beschreibung?: string;
    lieferrhythmus?: string;
    preis?: number;
  };
  price?: number;
  start: Date;
  ende?: Date;
  zusatzAbotypNames?: string[];
}

export interface Abwesenheit {
  id: number;
  aboId: number;
  datum: Date;
  bemerkung?: string;
}

export interface Lieferung {
  id: number;
  datum: Date;
  status: string;
  anzahlKoerbeZuLiefern: number;
  anzahlAbwesenheiten: number;
  anzahlSaldoZuTief: number;
  durchschnittspreis: number;
}
