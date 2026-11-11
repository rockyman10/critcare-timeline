/* Phase 1 practice questions. Each item uses facts from the trial cards. */
window.CRITCARE_QUESTIONS = {
  "meta": {
    "title": "Practice questions",
    "examDurationSeconds": 1620
  },
  "items": [
    {
      "id": "q-vasopressors-1",
      "placeholder": false,
      "topic": "vasopressors",
      "relatedTrialId": "soap-ii",
      "stem": "A patient is admitted to the intensive care unit with shock. The team is comparing dopamine with norepinephrine as first-line vasopressor therapy. Which statement matches the SOAP II trial?",
      "choices": [
        {
          "id": "a",
          "text": "Death at 28 days was significantly lower with norepinephrine (48.5% versus 52.5%; P=0.10)."
        },
        {
          "id": "b",
          "text": "Arrhythmic events were more common with norepinephrine than with dopamine (24.1% versus 12.4%)."
        },
        {
          "id": "c",
          "text": "Dopamine was associated with higher 28-day death among the 1044 patients with septic shock (P=0.03)."
        },
        {
          "id": "d",
          "text": "No significant 28-day mortality difference (52.5% versus 48.5%); more arrhythmias with dopamine."
        }
      ],
      "correctId": "d",
      "explanation": "SOAP II found no significant difference in 28-day death between dopamine and norepinephrine (52.5% versus 48.5%; odds ratio 1.17; 95% CI 0.97 to 1.42; P=0.10), so A misreads a nonsignificant P value. Arrhythmic events were more common with dopamine (24.1% versus 12.4%), the reverse of B. The P value of 0.03 applied to the 280 patients with cardiogenic shock; in septic shock it was 0.19, so C is incorrect.",
      "source": {
        "label": "SOAP II PubMed abstract",
        "pmid": "20200382",
        "doi": "10.1056/NEJMoa0907118",
        "note": "Primary result and arrhythmic-event counts used in this item."
      }
    },
    {
      "id": "q-vasopressors-2",
      "placeholder": false,
      "topic": "vasopressors",
      "relatedTrialId": "athos-3",
      "stem": "A patient remains in vasodilatory shock while receiving more than 0.2 micrograms of norepinephrine per kilogram of body weight per minute. Which statement matches the ATHOS-3 trial?",
      "choices": [
        {
          "id": "a",
          "text": "The mean arterial pressure response at hour 3 was similar with angiotensin II and placebo (69.9% versus 67.1%)."
        },
        {
          "id": "b",
          "text": "Hour-3 mean arterial pressure response was 69.9% with angiotensin II versus 23.4% with placebo."
        },
        {
          "id": "c",
          "text": "Death by day 28, the primary end point, was significantly lower with angiotensin II (46% versus 54%)."
        },
        {
          "id": "d",
          "text": "The primary end point was liberation from renal-replacement therapy, which was more frequent with angiotensin II."
        }
      ],
      "correctId": "b",
      "explanation": "The ATHOS-3 primary end point was a mean arterial pressure response at hour 3: 69.9% with angiotensin II versus 23.4% with placebo (odds ratio 7.95; 95% CI 4.76 to 13.3; P<0.001). Death by day 28 (46% versus 54%; P=0.12) was not the primary end point and was not significantly different. Renal-replacement therapy was not the primary end point. The 67.1% figure is the placebo serious-adverse-event rate, not a response rate.",
      "source": {
        "label": "ATHOS-3 PubMed abstract",
        "pmid": "28528561",
        "doi": "10.1056/NEJMoa1704154",
        "note": "Primary mean arterial pressure response used in this item."
      }
    },
    {
      "id": "q-vasopressors-3",
      "placeholder": false,
      "topic": "vasopressors",
      "relatedTrialId": "trial-65",
      "stem": "A patient aged 65 years or older is in the intensive care unit and is receiving a vasopressor for vasodilatory hypotension. Clinicians are considering a mean arterial pressure target of 60 to 65 millimeters of mercury. Which statement matches the 65 trial?",
      "choices": [
        {
          "id": "a",
          "text": "Permissive hypotension significantly reduced 90-day mortality (41.0% versus 43.8%; P=.15)."
        },
        {
          "id": "b",
          "text": "Permissive hypotension was shown to be noninferior to usual care for 90-day mortality."
        },
        {
          "id": "c",
          "text": "Death at 90 days was 41.0% versus 43.8% (difference -2.85%; P=.15)."
        },
        {
          "id": "d",
          "text": "Serious adverse events, the primary outcome, occurred in 6.2% versus 5.8% of patients."
        }
      ],
      "correctId": "c",
      "explanation": "In the 65 trial, 90-day mortality was 41.0% with permissive hypotension and 43.8% with usual care (absolute risk difference -2.85%; 95% CI -6.75 to 1.05; P=.15), which was not statistically significant, so A is incorrect. The trial was not designed as a noninferiority trial, so B overstates the result. Serious adverse events (6.2% versus 5.8%) were not the primary outcome.",
      "source": {
        "label": "65 trial open full text on PubMed Central",
        "pmid": "32049269",
        "doi": "10.1001/jama.2020.0930",
        "note": "Primary 90-day mortality result used in this item."
      }
    },
    {
      "id": "q-steroids-1",
      "placeholder": false,
      "topic": "steroids",
      "relatedTrialId": "annane-2002",
      "stem": "An adult with septic shock remains vasopressor-dependent after fluid resuscitation. A short corticotropin test is read as no response. Which statement matches the Annane 2002 trial?",
      "choices": [
        {
          "id": "a",
          "text": "Among nonresponders, 28-day mortality was 39.2% with hydrocortisone versus 36.1% with placebo (P=0.69)."
        },
        {
          "id": "b",
          "text": "Among corticotropin responders, corticosteroids significantly reduced 28-day mortality."
        },
        {
          "id": "c",
          "text": "Patients received hydrocortisone alone, without fludrocortisone, for 5 days followed by a taper."
        },
        {
          "id": "d",
          "text": "Among nonresponders, mortality was 53% versus 63% (hazard ratio 0.67; P=.02)."
        }
      ],
      "correctId": "d",
      "explanation": "Annane 2002 reported 60 deaths (53%) with hydrocortisone plus fludrocortisone and 73 deaths (63%) with placebo among corticotropin nonresponders (hazard ratio 0.67; 95% CI 0.47 to 0.95; P=.02). There was no significant difference among responders. The regimen was hydrocortisone plus fludrocortisone for 7 days. The 39.2% versus 36.1% result and the 5-day hydrocortisone-alone regimen with taper are from CORTICUS.",
      "source": {
        "label": "Annane 2002 PubMed abstract",
        "pmid": "12186604",
        "doi": "10.1001/jama.288.7.862",
        "note": "Primary result used in this item."
      }
    },
    {
      "id": "q-steroids-2",
      "placeholder": false,
      "topic": "steroids",
      "relatedTrialId": "adrenal",
      "stem": "An adult with septic shock is receiving mechanical ventilation. Which statement matches the ADRENAL trial?",
      "choices": [
        {
          "id": "a",
          "text": "90-day mortality was 43.0% (264 of 614) with hydrocortisone plus fludrocortisone and 49.1% (308 of 627) with placebo (relative risk 0.88; 95% CI 0.78 to 0.99)."
        },
        {
          "id": "b",
          "text": "At 90 days, 511 patients (27.9%) in the hydrocortisone group and 526 (28.8%) in the placebo group had died (odds ratio 0.95; 95% CI 0.82 to 1.10; P=0.50)."
        },
        {
          "id": "c",
          "text": "The mean number of ventilator-free days at 28 days was higher with dexamethasone than with routine intensive care (between-group difference 4.8 days; 95% CI 2.57 to 7.03; P<0.0001)."
        },
        {
          "id": "d",
          "text": "Among patients receiving invasive mechanical ventilation, 28-day mortality was 29.3% with dexamethasone and 41.4% with usual care (rate ratio 0.64; 95% CI 0.51 to 0.81)."
        }
      ],
      "correctId": "b",
      "explanation": "ADRENAL reported 90-day deaths in 511 patients (27.9%) with hydrocortisone and 526 (28.8%) with placebo (odds ratio 0.95; 95% CI 0.82 to 1.10; P=0.50). The 43.0% and 49.1% figures are from APROCCHSS. The 4.8 day ventilator-free difference is from DEXA-ARDS. The 29.3% and 41.4% figures are from RECOVERY.",
      "source": {
        "label": "ADRENAL PubMed abstract",
        "pmid": "29347874",
        "doi": "10.1056/NEJMoa1705835",
        "note": "Primary result used in this item."
      }
    },
    {
      "id": "q-steroids-3",
      "placeholder": false,
      "topic": "steroids",
      "relatedTrialId": "recovery-dex",
      "stem": "A patient hospitalized with COVID-19 is receiving oxygen and is not receiving invasive mechanical ventilation. Which statement matches the RECOVERY trial?",
      "choices": [
        {
          "id": "a",
          "text": "On oxygen without invasive ventilation, 28-day mortality was 23.3% versus 26.2%."
        },
        {
          "id": "b",
          "text": "The largest mortality reduction was among patients receiving no respiratory support at randomization."
        },
        {
          "id": "c",
          "text": "Benefit was limited to invasively ventilated patients; patients on oxygen alone showed no difference."
        },
        {
          "id": "d",
          "text": "At 60 days, 21% of patients assigned to dexamethasone and 36% assigned to control had died."
        }
      ],
      "correctId": "a",
      "explanation": "RECOVERY reported 28-day mortality of 23.3% with dexamethasone and 26.2% with usual care among patients receiving oxygen without invasive mechanical ventilation (rate ratio 0.82; 95% CI 0.72 to 0.94), so C is incorrect. The largest reduction was among invasively ventilated patients (29.3% versus 41.4%), and patients without respiratory support had 17.8% versus 14.0% (rate ratio 1.19; 95% CI 0.91 to 1.55), consistent with possible harm, so B is incorrect. The 21% versus 36% figures are DEXA-ARDS 60-day deaths.",
      "source": {
        "label": "RECOVERY open full text",
        "pmid": "32678530",
        "doi": "10.1056/NEJMoa2021436",
        "note": "Oxygen-without-invasive-ventilation subgroup of the primary mortality result. The same percentages and rate ratio are printed in the PubMed abstract."
      }
    },
    {
      "id": "q-fluids-1",
      "placeholder": false,
      "topic": "fluids",
      "relatedTrialId": "6s",
      "stem": "A patient with severe sepsis is receiving fluid resuscitation in the ICU. Which statement matches the 6S trial?",
      "choices": [
        {
          "id": "a",
          "text": "HES 130/0.42 and Ringer's acetate had similar 90-day mortality (18.0% versus 17.0%; P=0.26)."
        },
        {
          "id": "b",
          "text": "HES 130/0.42 reduced renal-replacement therapy compared with Ringer's acetate (16% versus 22%)."
        },
        {
          "id": "c",
          "text": "HES 130/0.42 raised 90-day mortality (51% versus 43%; relative risk 1.17; P=0.03)."
        },
        {
          "id": "d",
          "text": "HES 130/0.42 was noninferior to Ringer's acetate for death or end-stage kidney failure at 90 days."
        }
      ],
      "correctId": "c",
      "explanation": "In 6S, death at 90 days occurred in 51% with HES 130/0.42 and 43% with Ringer's acetate (relative risk 1.17; 95% CI 1.01 to 1.36; P=0.03). Renal-replacement therapy was more frequent with HES (22% versus 16%), the reverse of B. HES was associated with harm, so D is incorrect. The 18.0% versus 17.0% figures are from CHEST.",
      "source": {
        "label": "6S PubMed abstract",
        "pmid": "22738085",
        "doi": "10.1056/NEJMoa1204242",
        "note": "Primary result and renal-replacement therapy result used in this item."
      }
    },
    {
      "id": "q-fluids-2",
      "placeholder": false,
      "topic": "fluids",
      "relatedTrialId": "smart",
      "stem": "A critically ill adult admitted to an ICU needs intravenous isotonic crystalloid. Which statement matches the SMART trial?",
      "choices": [
        {
          "id": "a",
          "text": "A balanced solution, compared with 0.9% saline, was associated with 90-day mortality of 26.4% versus 27.2% (adjusted hazard ratio, 0.97; 95% CI, 0.90 to 1.05; P=.47)."
        },
        {
          "id": "b",
          "text": "Balanced multielectrolyte solution, compared with saline, was associated with 90-day mortality of 21.8% versus 22.0% (difference, -0.15 percentage points; 95% CI, -3.60 to 3.30; P=0.90)."
        },
        {
          "id": "c",
          "text": "Balanced crystalloids, compared with saline, were associated with a major adverse kidney event within 30 days in 14.3% versus 15.4% (marginal odds ratio, 0.91; 95% CI, 0.84 to 0.99; P=0.04)."
        },
        {
          "id": "d",
          "text": "Restrictive intravenous fluid, compared with standard intravenous fluid, was associated with 90-day mortality of 42.3% versus 42.1% (adjusted absolute difference, 0.1 percentage points; 95% CI, -4.7 to 4.9; P=0.96)."
        }
      ],
      "correctId": "c",
      "explanation": "SMART compared balanced crystalloids (lactated Ringer's solution or Plasma-Lyte A) with saline in critically ill adults. A major adverse kidney event within 30 days occurred in 14.3% versus 15.4% (marginal odds ratio, 0.91; 95% CI, 0.84 to 0.99; P=0.04). The 26.4% and 27.2% figures are from BaSICS, the 21.8% and 22.0% figures are from PLUS, and the 42.3% and 42.1% figures are from CLASSIC, a fluid-volume trial.",
      "source": {
        "label": "SMART PubMed abstract and open full text",
        "pmid": "29485925",
        "doi": "10.1056/NEJMoa1711584",
        "note": "Primary result used in this item."
      }
    },
    {
      "id": "q-fluids-3",
      "placeholder": false,
      "topic": "fluids",
      "relatedTrialId": "classic",
      "stem": "A patient with septic shock in the ICU has already received at least 1 liter of intravenous fluid, and the onset of shock was within 12 hours before screening. Which statement matches the CLASSIC trial?",
      "choices": [
        {
          "id": "a",
          "text": "Restrictive intravenous fluid reduced 90-day mortality compared with standard intravenous fluid."
        },
        {
          "id": "b",
          "text": "Restrictive intravenous fluid was shown to be noninferior to standard fluid for 90-day mortality."
        },
        {
          "id": "c",
          "text": "Restrictive intravenous fluid increased serious adverse events in the ICU compared with standard fluid."
        },
        {
          "id": "d",
          "text": "90-day mortality was 42.3% versus 42.1% (P=0.96)."
        }
      ],
      "correctId": "d",
      "explanation": "CLASSIC found 90-day mortality of 42.3% with restrictive fluid and 42.1% with standard fluid (adjusted absolute difference 0.1 percentage points; 95% CI -4.7 to 4.9; P=0.96), although median ICU fluid volume was 1798 versus 3811 milliliters. A nonsignificant difference does not by itself establish noninferiority (B). Serious adverse events were 29.4% versus 30.8%, not higher with restriction (C).",
      "source": {
        "label": "CLASSIC PubMed abstract",
        "pmid": "35709019",
        "doi": "10.1056/NEJMoa2202707",
        "note": "Primary result and fluid volumes used in this item."
      }
    },
    {
      "id": "q-sedation-1",
      "placeholder": false,
      "topic": "sedation",
      "relatedTrialId": "spice-iii",
      "stem": "An adult has been mechanically ventilated in the intensive care unit for less than 12 hours and is expected to need ventilation beyond the next calendar day. The clinicians are comparing dexmedetomidine as the sole or primary sedative with usual care, using a Richmond Agitation-Sedation Scale target of -2 to +1. Which statement matches the SPICE III trial?",
      "choices": [
        {
          "id": "a",
          "text": "Early dexmedetomidine significantly reduced 90-day mortality compared with usual care."
        },
        {
          "id": "b",
          "text": "Death at 90 days was 29.1% in both groups (adjusted risk difference 0.0 percentage points)."
        },
        {
          "id": "c",
          "text": "Most patients assigned to dexmedetomidine received no supplemental sedative during the first 2 days."
        },
        {
          "id": "d",
          "text": "Bradycardia and hypotension were less common with dexmedetomidine than with usual care."
        }
      ],
      "correctId": "b",
      "explanation": "SPICE III found 90-day mortality of 29.1% in both the dexmedetomidine and usual-care groups (adjusted risk difference 0.0 percentage points; 95% CI -2.9 to 2.8). In the dexmedetomidine group, 64% received supplemental propofol during the first 2 days, so C is incorrect. Bradycardia and hypotension were more common with dexmedetomidine, so D is incorrect.",
      "source": {
        "label": "SPICE III PubMed abstract",
        "pmid": "31112380",
        "doi": "10.1056/NEJMoa1904710",
        "note": "Primary result used in this item."
      }
    },
    {
      "id": "q-sedation-2",
      "placeholder": false,
      "topic": "sedation",
      "relatedTrialId": "mind-usa",
      "stem": "An adult with shock has hypoactive delirium in the intensive care unit. Haloperidol and ziprasidone are under discussion as treatment for the delirium. Which statement matches the MIND-USA trial?",
      "choices": [
        {
          "id": "a",
          "text": "The mean number of days alive and out of the hospital at 90 days was 35.8 with haloperidol and 32.9 with placebo (adjusted mean difference, 2.9 days; P = 0.22)."
        },
        {
          "id": "b",
          "text": "The adjusted median number of days alive without delirium or coma was 8.5 with placebo, 7.9 with haloperidol, and 8.7 with ziprasidone (P=0.26)."
        },
        {
          "id": "c",
          "text": "Agitated delirium occurred in 20% of patients managed with no sedation and in 7% of patients managed with interrupted sedation."
        },
        {
          "id": "d",
          "text": "The median number of days alive without delirium or coma was 7.0 with dexmedetomidine and 3.0 with lorazepam."
        }
      ],
      "correctId": "b",
      "explanation": "MIND-USA compared haloperidol and ziprasidone with placebo in patients with acute respiratory failure or shock and delirium. The adjusted median days alive without delirium or coma were 8.5 (95% CI, 5.6 to 9.9) with placebo, 7.9 (95% CI, 4.4 to 9.6) with haloperidol, and 8.7 (95% CI, 5.9 to 10.0) with ziprasidone (P=0.26). The other statements restate results from AID-ICU, Strom 2010, and MENDS.",
      "source": {
        "label": "MIND-USA PubMed abstract and open full text",
        "pmid": "30346242",
        "doi": "10.1056/NEJMoa1808217",
        "note": "Adjusted median days alive without delirium or coma and the overall P value."
      }
    },
    {
      "id": "q-sedation-3",
      "placeholder": false,
      "topic": "sedation",
      "relatedTrialId": "strom-2010",
      "stem": "An adult is expected to need mechanical ventilation for more than 24 hours. One strategy under discussion is no continuous sedation, with bolus morphine, compared with propofol for 48 hours followed by midazolam and daily interruption until awake. Which statement matches the Strom 2010 trial?",
      "choices": [
        {
          "id": "a",
          "text": "The median duration of mechanical ventilation was 4.9 days when sedative infusions were interrupted daily and 7.3 days when infusions were interrupted only at clinician discretion."
        },
        {
          "id": "b",
          "text": "Median duration of mechanical ventilation was 123 hours with dexmedetomidine and 164 hours with midazolam."
        },
        {
          "id": "c",
          "text": "Patients receiving no sedation had a mean of 13.8 days without ventilation, compared with 9.6 days with interrupted sedation (mean difference, 4.2 days; 95% CI, 0.3-8.1; p=0.0191)."
        },
        {
          "id": "d",
          "text": "Median time to extubation was 3.7 days with dexmedetomidine and 5.6 days with midazolam."
        }
      ],
      "correctId": "c",
      "explanation": "Strom 2010 compared a no-sedation protocol, with bolus morphine, with propofol for 48 hours then midazolam, interrupted daily until awake, plus bolus morphine. Mean days without ventilation were 13.8 (standard deviation 11.0) versus 9.6 (standard deviation 10.0), a mean difference of 4.2 days (95% CI 0.3-8.1; p=0.0191). The other statements restate results from Kress 2000, MIDEX, and SEDCOM.",
      "source": {
        "label": "Strom 2010 PubMed abstract",
        "pmid": "20116842",
        "doi": "10.1016/S0140-6736(09)62072-9",
        "note": "Primary result used in this item."
      }
    },
    {
      "id": "q-antimicrobials-1",
      "placeholder": false,
      "topic": "antimicrobials",
      "relatedTrialId": "balance",
      "stem": "A 72-year-old intensive care unit patient has a urinary-source gram-negative bloodstream infection. Staphylococcus aureus was not isolated, the patient is not severely immunosuppressed, and no focus requires prolonged treatment. Which statement matches the BALANCE trial?",
      "choices": [
        {
          "id": "a",
          "text": "Seven days was noninferior to 14 days for 90-day death (14.5% versus 16.1%)."
        },
        {
          "id": "b",
          "text": "Seven days was superior to 14 days and significantly reduced death by 90 days."
        },
        {
          "id": "c",
          "text": "BALANCE enrolled only intensive care unit patients and compared 8 days with 15 days of antibiotics."
        },
        {
          "id": "d",
          "text": "BALANCE included patients with Staphylococcus aureus bacteremia and single positive cultures."
        }
      ],
      "correctId": "a",
      "explanation": "BALANCE enrolled hospitalized patients with bloodstream infection, 55.0% in the intensive care unit and 45.0% on wards. Death by 90 days was 14.5% with 7 days and 16.1% with 14 days (difference -1.6 percentage points; 95.7% CI -4.0 to 0.8), meeting the 4-percentage-point noninferiority margin, but superiority was not shown (B). Staphylococcus aureus bacteremia and single cultures with possible contaminants were excluded (D). The 8-day versus 15-day comparison is PneumA.",
      "source": {
        "label": "BALANCE PubMed abstract",
        "pmid": "39565030",
        "doi": "10.1056/NEJMoa2404991",
        "note": "Primary result and enrollment location used in this item."
      }
    },
    {
      "id": "q-antimicrobials-2",
      "placeholder": false,
      "topic": "antimicrobials",
      "relatedTrialId": "merino",
      "stem": "A hospitalized adult has Escherichia coli bloodstream infection that is nonsusceptible to ceftriaxone and susceptible to piperacillin-tazobactam. Which statement matches the MERINO trial?",
      "choices": [
        {
          "id": "a",
          "text": "Piperacillin-tazobactam was noninferior to meropenem for 30-day mortality."
        },
        {
          "id": "b",
          "text": "Thirty-day mortality was similar, but meropenem caused more serious adverse events."
        },
        {
          "id": "c",
          "text": "Most enrolled patients were in the intensive care unit at the time of randomization."
        },
        {
          "id": "d",
          "text": "Noninferiority was not shown (30-day mortality 12.3% versus 3.7%)."
        }
      ],
      "correctId": "d",
      "explanation": "MERINO found 30-day mortality of 12.3% with piperacillin-tazobactam and 3.7% with meropenem (risk difference 8.6%; 1-sided 97.5% CI upper bound 14.5%). That exceeded the 5% noninferiority margin, so noninferiority was not shown. Nonfatal serious adverse events were 2.7% versus 1.6%. Table 1 lists intensive care unit admission as 13 (7.0%) and 14 (7.5%).",
      "source": {
        "label": "MERINO open full text on PubMed Central",
        "pmid": "30208454",
        "doi": "10.1001/jama.2018.12163",
        "note": "Primary mortality result and intensive care unit admission counts used in this item."
      }
    },
    {
      "id": "q-antimicrobials-3",
      "placeholder": false,
      "topic": "antimicrobials",
      "relatedTrialId": "acorn",
      "stem": "An adult arrives in the emergency department, and within 12 hours a clinician orders an antipseudomonal antibiotic for suspected infection. Which statement matches the ACORN trial?",
      "choices": [
        {
          "id": "a",
          "text": "Cefepime caused significantly more acute kidney injury or death by day 14 than piperacillin-tazobactam."
        },
        {
          "id": "b",
          "text": "Day-14 kidney injury or death did not differ (odds ratio 0.95)."
        },
        {
          "id": "c",
          "text": "Piperacillin-tazobactam was given by 30-minute infusion every 6 hours under the institutional protocol."
        },
        {
          "id": "d",
          "text": "ACORN was a double-blind trial conducted only in intensive care units."
        }
      ],
      "correctId": "b",
      "explanation": "ACORN found no significant difference in the highest stage of acute kidney injury or death by day 14 (odds ratio 0.95; 95% CI 0.80 to 1.13; P=.56). Cefepime was associated with fewer days alive and free of delirium and coma (mean 11.9 versus 12.2; odds ratio 0.79). Piperacillin-tazobactam was given as an extended infusion over 4 hours every 8 hours after a bolus. The trial was open-label, at one center, and 94.7% of patients were enrolled in the emergency department.",
      "source": {
        "label": "ACORN PubMed abstract",
        "pmid": "37837651",
        "doi": "10.1001/jama.2023.20583",
        "note": "Primary kidney outcome, enrollment location, and delirium- and coma-free days used in this item."
      }
    },
    {
      "id": "q-ulcer-1",
      "placeholder": false,
      "topic": "ulcer-prophylaxis",
      "relatedTrialId": "cook-1998",
      "stem": "A patient who requires mechanical ventilation is in the ICU, and the team is reviewing trials of stress ulcer prophylaxis. Which statement matches Cook 1998?",
      "choices": [
        {
          "id": "a",
          "text": "Clinically important bleeding was 1.7% with ranitidine versus 3.8% with sucralfate (relative risk 0.44)."
        },
        {
          "id": "b",
          "text": "Sucralfate significantly reduced ventilator-associated pneumonia compared with ranitidine."
        },
        {
          "id": "c",
          "text": "Ranitidine reduced bleeding compared with a group that received no prophylaxis, with no difference in pneumonia."
        },
        {
          "id": "d",
          "text": "Sucralfate and ranitidine produced similar rates of clinically important bleeding."
        }
      ],
      "correctId": "a",
      "explanation": "Cook 1998 reported clinically important gastrointestinal bleeding in 1.7% with ranitidine and 3.8% with sucralfate (relative risk 0.44; 95% CI 0.21 to 0.92; P=0.02). Ventilator-associated pneumonia was 19.1% versus 16.2% (P=0.19), not significantly different (B). There was no group managed without prophylaxis; each patient received one active drug and placebo by the other route (C).",
      "source": {
        "label": "Cook 1998 PubMed abstract",
        "pmid": "9504939",
        "doi": "10.1056/NEJM199803193381203",
        "note": "Primary result used in this item."
      }
    },
    {
      "id": "q-ulcer-2",
      "placeholder": false,
      "topic": "ulcer-prophylaxis",
      "relatedTrialId": "peptic",
      "stem": "A patient required invasive mechanical ventilation within 24 hours of ICU admission. The unit is comparing a default proton pump inhibitor strategy with a default histamine-2 receptor blocker strategy for stress ulcer prophylaxis. Which statement matches PEPTIC?",
      "choices": [
        {
          "id": "a",
          "text": "The proton pump inhibitor strategy significantly reduced hospital mortality by day 90."
        },
        {
          "id": "b",
          "text": "Clinically important upper gastrointestinal bleeding was more frequent with the proton pump inhibitor strategy."
        },
        {
          "id": "c",
          "text": "Patients were individually randomized, and clinicians were blinded to drug class."
        },
        {
          "id": "d",
          "text": "Hospital mortality by day 90 was 18.3% versus 17.5% (risk ratio 1.05; P=.054)."
        }
      ],
      "correctId": "d",
      "explanation": "PEPTIC reported in-hospital death by day 90 in 18.3% with the proton pump inhibitor strategy and 17.5% with the histamine-2 receptor blocker strategy (risk ratio 1.05; 95% CI 1.00 to 1.10; P=.054), not statistically significant. Clinically important upper gastrointestinal bleeding was lower with proton pump inhibitors (1.3% versus 1.8%). PEPTIC was an open-label cluster-crossover trial, with substantial crossover between assigned strategies.",
      "source": {
        "label": "PEPTIC open full text on PubMed Central",
        "pmid": "31950977",
        "doi": "10.1001/jama.2019.22190",
        "note": "Primary result and crossover statement used in this item."
      }
    },
    {
      "id": "q-ulcer-3",
      "placeholder": false,
      "topic": "ulcer-prophylaxis",
      "relatedTrialId": "revise",
      "stem": "A critically ill adult is undergoing invasive ventilation, and pantoprazole is being compared with placebo for stress ulcer prophylaxis. Which statement matches REVISE?",
      "choices": [
        {
          "id": "a",
          "text": "Pantoprazole lowered bleeding (1.0% versus 3.5%) without a mortality effect."
        },
        {
          "id": "b",
          "text": "Pantoprazole reduced clinically important bleeding and significantly reduced 90-day mortality."
        },
        {
          "id": "c",
          "text": "Pantoprazole did not reduce clinically important bleeding, and 90-day mortality was 31.1% versus 30.4%."
        },
        {
          "id": "d",
          "text": "Pantoprazole increased ventilator-associated pneumonia compared with placebo."
        }
      ],
      "correctId": "a",
      "explanation": "REVISE reported clinically important upper gastrointestinal bleeding in 1.0% with pantoprazole and 3.5% with placebo (hazard ratio 0.30; 95% CI 0.19 to 0.47; P<0.001). Death at 90 days was 29.1% versus 30.9% (hazard ratio 0.94; 95% CI 0.85 to 1.04; P=0.25). Ventilator-associated pneumonia was a prespecified secondary outcome, and the abstract states that all other secondary outcomes were similar. The 31.1% versus 30.4% mortality figures are from SUP-ICU.",
      "source": {
        "label": "REVISE PubMed abstract",
        "pmid": "38875111",
        "doi": "10.1056/NEJMoa2404245",
        "note": "Primary efficacy and primary safety results used in this item."
      }
    }
  ]
};
