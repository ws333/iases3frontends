import { EmailComponentProps } from "../../types/types";
import { styles } from "./lettersStyles";

const LetterItalian = ({ name }: EmailComponentProps) => {
    return (
        <>
            <meta httpEquiv="content-type" content="text/html; charset=UTF-8" lang="en" />
            <div>
                <p style={{ ...styles, textIndent: 0 }}>Gentile {name}</p>
                <br />
                <p style={styles}>
                    <span>
                        Nonostante le dichiarazioni da fonti militari, scientifiche e politiche contrarie, crediamo che
                        gli UFO o gli UAP non rappresentino una minaccia di alcun tipo per la sicurezza nazionale o
                        globale o per l'umanità in generale.
                    </span>
                </p>
                <p style={styles}>
                    <span>
                        Esistono prove schiaccianti e ben documentate e migliaia di resoconti di testimoni oculari che
                        questi oggetti sono stati presenti nel corso della storia della Terra senza effetti dannosi
                        sulle attività quotidiane dell'umanità.
                    </span>
                </p>
                <p style={styles}>
                    <span>
                        Senza sostenere o promuovere alcuna teoria del complotto correlata, riteniamo che alcune
                        organizzazioni stiano nascondendo la conoscenza di questo fenomeno per paura irrazionale e per
                        ragioni egoistiche. È ora che i segreti finiscano e che venga avviato un programma di
                        trasparente comunicazione al pubblico al servizio dell'umanità.
                    </span>
                </p>
                <p style={styles}>
                    <span>
                        Pertanto, chiediamo rispettosamente, ma fermamente, che lei, nella sua veste ufficiale, divulghi
                        e rilasci immediatamente e pubblicamente, entro un anno dal ricevimento di questa lettera, tutte
                        le informazioni che sono in suo possesso, o di chiunque altro lei sia a conoscenza, riguardanti
                        UFO, UAP e qualsiasi indicazione di vita, attività e tecnologie extraterrestri, e dichiari
                        pubblicamente il suo sostegno al rilascio completo di tutte queste informazioni senza
                        limitazioni, modifiche, revisioni, ridicolizzazioni o falsificazioni.
                    </span>
                </p>
                <p style={styles}>
                    <span>
                        Tenga presente che i membri di questo movimento sociale intendono votare ed eleggere solo i
                        leader e i rappresentanti che sostengono e promuovono pubblicamente e attivamente tale
                        divulgazione e, con i nostri voti, sostituire tutti i funzionari che non lo fanno. Grazie.
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

export default LetterItalian;
