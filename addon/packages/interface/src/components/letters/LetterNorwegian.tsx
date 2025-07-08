import { EmailComponentProps } from "../../types/types";
import { styles } from "./lettersStyles";

const LetterNorwegian = ({ name }: EmailComponentProps) => {
    return (
        <>
            <meta httpEquiv="content-type" content="text/html; charset=UTF-8" lang="no" />
            <div>
                <p style={{ ...styles, textIndent: 0 }}>Til {name}</p>
                <br />
                <p style={styles}>
                    <span>
                        Til tross for at det finnes militære, vitenskapelige og politiske uttalelser som påstår det
                        motsatte, er vi av den oppfatning at UFOer eller UAPer ikke på noen måte utgjør en trussel mot
                        hverken nasjonal eller global sikkerhet, eller mot menneskeheten som sådan.
                    </span>
                </p>
                <p style={styles}>
                    <span>
                        Det foreligger overveldende og godt dokumenterte bevis samt tusenvis av øyenvitneskildringer som
                        viser at disse objektene har vært til stede gjennom hele verdenshistorien uten skadelig effekt
                        på menneskelige aktiviteter.
                    </span>
                </p>
                <p style={styles}>
                    <span>
                        Uten å støtte eller fremme relaterte konspirasjonsteorier, mener vi at enkelte organisasjoner
                        tilbakeholder kunnskap om dette fenomenet på grunn av irrasjonell frykt og egne interesser.
                        Tiden er kommet for å gjøre slutt på hemmelighold og starte et program for transparent
                        folkeopplysning til beste for menneskeheten.
                    </span>
                </p>
                <p style={styles}>
                    <span>
                        Vi anmoder derfor respektfullt, men på det sterkeste, at du i egenskap av din stilling
                        umiddelbart offentliggjør og gir innsyn i all informasjon du selv er i besittelse av, eller som
                        du vet andre er i besittelse av, om UFOer, UAPer og alle indikasjoner på utenomjordisk liv,
                        aktiviteter og teknologier innen ett år fra du mottar dette brevet, samt at du offentlig
                        uttrykker din støtte for at alle slike opplysninger skal offentliggjøres, uten noen form for
                        begrensning, redigering, sladding, latterliggjøring eller forfalskning.
                    </span>
                </p>
                <p style={styles}>
                    <span>
                        Vi ber deg være oppmerksom på at medlemmene av denne sosiale bevegelsen har til hensikt å kun
                        stemme på og velge ledere og representanter som offentlig og aktivt støtter og fremmer slik
                        offentliggjøring, og med vår stemmegiving erstatte alle myndighetspersoner som ikke gjør det.
                        Takk for din oppmerksomhet.
                    </span>
                </p>
                <br />
                <p style={{ ...styles, textIndent: 0 }}>
                    <i>- The Interstellar Alliance Social Experiment Group</i>
                </p>
            </div>
        </>
    );
};

export default LetterNorwegian;
