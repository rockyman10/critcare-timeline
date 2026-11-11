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
          "text": "Death at 28 days was 52.5% with dopamine and 48.5% with norepinephrine (odds ratio 1.17; 95% confidence interval 0.97 to 1.42; P=0.10), and arrhythmic events were more common with dopamine (24.1% versus 12.4%)."
        },
        {
          "id": "b",
          "text": "Death at 28 days was significantly lower with dopamine than with norepinephrine (48.5% versus 52.5%; P=0.10)."
        },
        {
          "id": "c",
          "text": "Arrhythmic events occurred in 12.4% of patients treated with dopamine and 24.1% of patients treated with norepinephrine (P<0.001)."
        },
        {
          "id": "d",
          "text": "Among the 1044 patients with septic shock, dopamine was associated with increased 28-day death (P=0.03)."
        }
      ],
      "correctId": "a",
      "explanation": "SOAP II included 1679 patients with shock. Death at 28 days was 52.5% with dopamine and 48.5% with norepinephrine (odds ratio 1.17; 95% confidence interval 0.97 to 1.42; P=0.10), so the difference was not significant. Arrhythmic events were more common with dopamine (207 events [24.1%] versus 102 events [12.4%]). The P value of 0.03 applies to the 280 patients with cardiogenic shock; in the 1044 patients with septic shock the reported P value was 0.19.",
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
          "text": "Angiotensin II and placebo produced the same mean arterial pressure response at hour 3 (69.9% and 67.1%)."
        },
        {
          "id": "b",
          "text": "Death by day 28 was the primary end point and was 46% with angiotensin II versus 54% with placebo (hazard ratio 0.78; 95% confidence interval 0.57 to 1.07; P=0.12)."
        },
        {
          "id": "c",
          "text": "The trial compared a mean arterial pressure target of 80 to 85 millimeters of mercury with a target of 65 to 70 millimeters of mercury."
        },
        {
          "id": "d",
          "text": "A mean arterial pressure response at hour 3 occurred in 114 of 163 patients (69.9%) assigned to angiotensin II and in 37 of 158 patients (23.4%) assigned to placebo (odds ratio 7.95; 95% confidence interval 4.76 to 13.3; P<0.001)."
        }
      ],
      "correctId": "d",
      "explanation": "ATHOS-3 included 321 patients who received angiotensin II (163) or placebo (158) for vasodilatory shock while receiving more than 0.2 micrograms of norepinephrine per kilogram per minute, or an equivalent dose. The primary end point, a mean arterial pressure response at hour 3, occurred in 69.9% and 23.4% (odds ratio 7.95; 95% confidence interval 4.76 to 13.3; P<0.001). Death by day 28 was 46% and 54% (P=0.12) and was not the primary end point. Serious adverse events were reported in 60.7% and 67.1%. The mean arterial pressure targets of 80 to 85 and 65 to 70 millimeters of mercury are the SEPSISPAM comparison.",
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
          "text": "Permissive hypotension produced a statistically significant reduction in 90-day mortality, from 43.8% with usual care to 41.0% (P=.15)."
        },
        {
          "id": "b",
          "text": "At 90 days, 500 of 1221 patients (41.0%) in the permissive hypotension group and 544 of 1242 patients (43.8%) in the usual care group had died (absolute risk difference, -2.85%; 95% confidence interval, -6.75 to 1.05; P=.15)."
        },
        {
          "id": "c",
          "text": "Serious adverse events were the primary outcome and occurred in 6.2% of the permissive hypotension group and 5.8% of the usual care group."
        },
        {
          "id": "d",
          "text": "The 65 trial reported 28-day mortality of 36.6% with a mean arterial pressure target of 80 to 85 millimeters of mercury and 34.0% with a target of 65 to 70 millimeters of mercury (hazard ratio 1.07; P=0.57)."
        }
      ],
      "correctId": "b",
      "explanation": "The 65 trial compared a mean arterial pressure target of 60 to 65 millimeters of mercury with usual care in patients aged 65 years or older with vasodilatory hypotension. At 90 days, 500 of 1221 patients (41.0%) and 544 of 1242 patients (43.8%) had died (absolute risk difference, -2.85%; 95% confidence interval, -6.75 to 1.05; P=.15). The trial reported that this reduction was not statistically significant. Serious adverse events were reported in 79 of 1283 patients (6.2%) and 75 of 1300 patients (5.8%) and were not the primary outcome. The 36.6% and 34.0% figures, with hazard ratio 1.07, are the 28-day mortality results from SEPSISPAM.",
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
          "text": "Among nonresponders, there were 60 deaths (53%) in the corticosteroid group and 73 deaths (63%) in the placebo group (hazard ratio 0.67; 95% CI 0.47 to 0.95; P=.02)."
        },
        {
          "id": "b",
          "text": "Among nonresponders, 28-day mortality was 39.2% with hydrocortisone and 36.1% with placebo (P=0.69)."
        },
        {
          "id": "c",
          "text": "At 90 days, 511 patients (27.9%) assigned to hydrocortisone and 526 (28.8%) assigned to placebo had died (odds ratio 0.95; 95% CI 0.82 to 1.10; P=0.50)."
        },
        {
          "id": "d",
          "text": "By day 28, death occurred in 25 of 400 patients (6.2%) with hydrocortisone and in 47 of 395 patients (11.9%) with placebo."
        }
      ],
      "correctId": "a",
      "explanation": "Annane 2002 reported 60 deaths (53%) with corticosteroids and 73 deaths (63%) with placebo among corticotropin nonresponders (hazard ratio 0.67; 95% CI 0.47 to 0.95; P=.02). The 39.2% and 36.1% figures are the CORTICUS nonresponder results. The 27.9% and 28.8% figures are the ADRENAL 90-day results. The 6.2% and 11.9% figures are the CAPE COD 28-day results.",
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
          "text": "At 60 days, 29 (21%) patients assigned to dexamethasone and 50 (36%) assigned to control had died."
        },
        {
          "id": "b",
          "text": "Among patients receiving oxygen without invasive mechanical ventilation, 28-day mortality was 23.3% with dexamethasone and 26.2% with usual care (rate ratio 0.82; 95% CI 0.72 to 0.94)."
        },
        {
          "id": "c",
          "text": "Among corticotropin nonresponders with septic shock, 28-day mortality was 39.2% with hydrocortisone and 36.1% with placebo (P=0.69)."
        },
        {
          "id": "d",
          "text": "By day 28, death occurred in 6.2% of the hydrocortisone group and 11.9% of the placebo group in severe community-acquired pneumonia."
        }
      ],
      "correctId": "b",
      "explanation": "RECOVERY reported 28-day mortality of 23.3% with dexamethasone and 26.2% with usual care among patients hospitalized with COVID-19 who were receiving oxygen without invasive mechanical ventilation (rate ratio 0.82; 95% CI 0.72 to 0.94). The 21% and 36% figures are the DEXA-ARDS 60-day deaths. The 39.2% and 36.1% figures are from CORTICUS. The 6.2% and 11.9% figures are from CAPE COD.",
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
          "text": "Assignment to HES 130/0.42, compared with Ringer's acetate, was associated with death at 90 days in 51% versus 43% (relative risk, 1.17; 95% CI, 1.01 to 1.36; P=0.03) and with renal-replacement therapy in 22% versus 16%."
        },
        {
          "id": "b",
          "text": "Assignment to 6% HES (130/0.4), compared with saline, was associated with death at 90 days in 18.0% versus 17.0% (relative risk, 1.06; 95% CI, 0.96 to 1.18; P=0.26)."
        },
        {
          "id": "c",
          "text": "Assignment to 4 percent albumin, compared with saline, was associated with 726 deaths versus 729 deaths at 28 days (relative risk, 0.99; 95% CI, 0.91 to 1.09; P=0.87)."
        },
        {
          "id": "d",
          "text": "Assignment to balanced multielectrolyte solution, compared with saline, was associated with death at 90 days in 21.8% versus 22.0% (difference, -0.15 percentage points; 95% CI, -3.60 to 3.30; P=0.90)."
        }
      ],
      "correctId": "a",
      "explanation": "In 6S, patients with severe sepsis were assigned to HES 130/0.42 or Ringer's acetate. Death at 90 days occurred in 201 of 398 patients (51%) and 172 of 400 patients (43%) (relative risk, 1.17; 95% CI, 1.01 to 1.36; P=0.03), and renal-replacement therapy was used in 22% versus 16%. The 18.0% and 17.0% mortality figures are from CHEST, the 726 and 729 death counts are from SAFE, and the 21.8% and 22.0% figures are from PLUS.",
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
          "text": "A restrictive fluid strategy, compared with a liberal fluid strategy, was associated with death before discharge home by day 90 in 14.0% versus 14.9% (estimated difference, -0.9 percentage points; 95% CI, -4.4 to 2.6; P=0.61)."
        },
        {
          "id": "b",
          "text": "Restricted intravenous fluid, compared with standard intravenous fluid, was associated with death at 90 days in 42.3% versus 42.1% (adjusted absolute difference, 0.1 percentage points; 95% CI, -4.7 to 4.9; P=0.96). Median intravenous fluid in the ICU was 1798 milliliters versus 3811 milliliters."
        },
        {
          "id": "c",
          "text": "Albumin 20% plus crystalloid, compared with crystalloid alone, was associated with death at 28 days in 31.8% versus 32.0% (relative risk, 1.00; 95% CI, 0.87 to 1.14; P=0.94)."
        },
        {
          "id": "d",
          "text": "Intensive insulin therapy, compared with conventional insulin therapy, was associated with severe hypoglycemia in 17.0% versus 4.1% (P<0.001) in a factorial trial that also assigned 10% pentastarch or modified Ringer's lactate."
        }
      ],
      "correctId": "b",
      "explanation": "CLASSIC was a fluid-volume trial in adults with septic shock in the ICU who had already received at least 1 liter of intravenous fluid, with shock onset within 12 hours. Death at 90 days occurred in 42.3% with restrictive fluid and 42.1% with standard fluid (adjusted absolute difference, 0.1 percentage points; 95% CI, -4.7 to 4.9; P=0.96). Median intravenous fluid in the ICU was 1798 milliliters versus 3811 milliliters. The 14.0% and 14.9% figures are from CLOVERS, also a fluid-volume trial. The 31.8% and 32.0% figures are from ALBIOS. The 17.0% and 4.1% hypoglycemia figures are from VISEP, which also tested pentastarch.",
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
          "text": "Death from any cause at 90 days occurred in 29.1% of the dexmedetomidine group and 29.1% of the usual-care group (adjusted risk difference, 0.0 percentage points; 95% CI, -2.9 to 2.8)."
        },
        {
          "id": "b",
          "text": "The median number of days alive without delirium or coma was 7.0 with dexmedetomidine and 3.0 with lorazepam."
        },
        {
          "id": "c",
          "text": "The percentage of time within the target sedation range was 77.3% with dexmedetomidine and 75.1% with midazolam."
        },
        {
          "id": "d",
          "text": "The adjusted median number of days alive without delirium or coma was 10.7 days with dexmedetomidine and 10.8 days with propofol."
        }
      ],
      "correctId": "a",
      "explanation": "SPICE III compared early dexmedetomidine with usual care. In the modified intention-to-treat analysis of 3904 patients, death at 90 days occurred in 566 of 1948 patients (29.1%) and in 569 of 1956 patients (29.1%), with an adjusted risk difference of 0.0 percentage points (95% CI, -2.9 to 2.8). The other statements restate results from MENDS, SEDCOM, and MENDS2.",
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
      "stem": "A 72-year-old patient on a hospital ward has a urinary-source bloodstream infection. Staphylococcus aureus was not isolated, and there is no focus described as requiring prolonged treatment. Which statement matches the BALANCE trial?",
      "choices": [
        {
          "id": "a",
          "text": "BALANCE enrolled only intensive care unit patients and compared 8 days of antibiotics with 15 days."
        },
        {
          "id": "b",
          "text": "BALANCE included hospitalized patients with bloodstream infection, 55.0% of whom were in the intensive care unit and 45.0% of whom were on hospital wards at enrollment. Death by 90 days was 14.5% with 7 days of antibiotics versus 16.1% with 14 days (difference, -1.6 percentage points)."
        },
        {
          "id": "c",
          "text": "BALANCE found 30-day mortality of 12.3% with piperacillin-tazobactam versus 3.7% with meropenem."
        },
        {
          "id": "d",
          "text": "BALANCE reported a day-28 composite outcome in 47% of patients assigned to continuous meropenem versus 49% assigned to intermittent meropenem."
        }
      ],
      "correctId": "b",
      "explanation": "BALANCE randomly assigned hospitalized patients with bloodstream infection, not an intensive care unit-only population: 55.0% were in the intensive care unit and 45.0% were on hospital wards. Death by 90 days was 14.5% with 7 days and 16.1% with 14 days (difference, -1.6 percentage points; 95.7% CI, -4.0 to 0.8), which the trial reported as noninferiority of the shorter course. The 8-day versus 15-day comparison is PneumA, the 12.3% versus 3.7% mortality is MERINO, and the 47% versus 49% composite is MERCY.",
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
      "stem": "A hospitalized adult on a medical ward has Escherichia coli bloodstream infection that is nonsusceptible to ceftriaxone and susceptible to piperacillin-tazobactam. Which statement matches the MERINO trial?",
      "choices": [
        {
          "id": "a",
          "text": "MERINO found 30-day mortality of 12.3% with piperacillin-tazobactam versus 3.7% with meropenem (risk difference 8.6%) and did not show noninferiority at a 5% margin. Intensive care unit admission was recorded in 7.0% and 7.5% of the two groups."
        },
        {
          "id": "b",
          "text": "MERINO showed that 7 days of antibiotics was noninferior to 14 days for 90-day mortality, with deaths in 14.5% versus 16.1%."
        },
        {
          "id": "c",
          "text": "MERINO compared 8 days with 15 days of treatment for ventilator-associated pneumonia and reported mortality of 18.8% versus 17.2%."
        },
        {
          "id": "d",
          "text": "MERINO found no significant difference in the highest stage of acute kidney injury or death by day 14 (odds ratio 0.95)."
        }
      ],
      "correctId": "a",
      "explanation": "MERINO enrolled hospitalized patients with ceftriaxone-nonsusceptible Escherichia coli or Klebsiella bloodstream infection. Intensive care unit admission was 7.0% in the piperacillin-tazobactam group and 7.5% in the meropenem group. Death by 30 days was 12.3% (23 of 187) versus 3.7% (7 of 191), risk difference 8.6%, and the 1-sided 97.5% CI extended to 14.5%, beyond the 5% noninferiority margin (P=.90 for noninferiority). The 7-day versus 14-day result is BALANCE, the 18.8% versus 17.2% result is PneumA, and the acute kidney injury odds ratio 0.95 is ACORN.",
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
          "text": "ACORN compared selective decontamination of the digestive tract with standard care and reported in-hospital mortality of 27.0% versus 29.1%."
        },
        {
          "id": "b",
          "text": "ACORN was conducted only in intensive care units and reported 90-day mortality of 24.9% with continuous infusion versus 26.8% with intermittent infusion."
        },
        {
          "id": "c",
          "text": "ACORN included 2511 patients in the primary analysis, 94.7% of whom were enrolled in the emergency department. The highest stage of acute kidney injury or death by day 14 did not differ significantly (odds ratio 0.95). Mean days alive and free of delirium and coma were 11.9 with cefepime versus 12.2 with piperacillin-tazobactam."
        },
        {
          "id": "d",
          "text": "ACORN randomly assigned patients with complicated intraabdominal infection and reported a 30-day composite outcome in 21.8% versus 22.3%."
        }
      ],
      "correctId": "c",
      "explanation": "ACORN assigned cefepime or piperacillin-tazobactam to adults in the emergency department or medical intensive care unit. Of 2511 patients in the primary analysis, 94.7% were enrolled in the emergency department. The highest stage of acute kidney injury or death by day 14 did not differ significantly (odds ratio 0.95, 95% CI 0.80 to 1.13, P=.56). Mean days alive and free of delirium and coma within 14 days were 11.9 versus 12.2 (odds ratio 0.79). The 27.0% versus 29.1% mortality is SuDDICU, the 24.9% versus 26.8% mortality is BLING III, and the 21.8% versus 22.3% composite is STOP-IT.",
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
          "text": "Death by 90 days occurred in 31.1% of patients assigned to pantoprazole versus 30.4% assigned to placebo."
        },
        {
          "id": "b",
          "text": "Clinically important gastrointestinal bleeding occurred in 1.7 percent of patients receiving ranitidine versus 3.8 percent receiving sucralfate (relative risk, 0.44; P=0.02)."
        },
        {
          "id": "c",
          "text": "Clinically important upper gastrointestinal bleeding occurred in 1.0% of patients receiving pantoprazole versus 3.5% receiving placebo."
        },
        {
          "id": "d",
          "text": "Hospital mortality by day 90 was 18.3% with a proton pump inhibitor strategy versus 17.5% with a histamine-2 receptor blocker strategy."
        }
      ],
      "correctId": "b",
      "explanation": "Cook 1998 reported clinically important gastrointestinal bleeding in 10 of 596 patients (1.7 percent) receiving ranitidine versus 23 of 604 patients (3.8 percent) receiving sucralfate (relative risk, 0.44; 95 percent confidence interval, 0.21 to 0.92; P=0.02). The other statements match SUP-ICU, REVISE, and PEPTIC.",
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
          "text": "Clinically important gastrointestinal bleeding occurred in 1.7 percent with ranitidine versus 3.8 percent with sucralfate (relative risk, 0.44; P=0.02)."
        },
        {
          "id": "b",
          "text": "Death by 90 days occurred in 31.1% with pantoprazole versus 30.4% with placebo (relative risk, 1.02; P=0.76)."
        },
        {
          "id": "c",
          "text": "Hospital mortality by day 90 was 18.3% with the proton pump inhibitor strategy versus 17.5% with the histamine-2 receptor blocker strategy (risk ratio, 1.05; P=.054), and crossover in use of the assigned medication limits interpretation."
        },
        {
          "id": "d",
          "text": "Clinically important upper gastrointestinal bleeding occurred in 1.0% with pantoprazole versus 3.5% with placebo (hazard ratio, 0.30; P<0.001)."
        }
      ],
      "correctId": "c",
      "explanation": "PEPTIC reported in-hospital death by day 90 in 18.3% of the proton pump inhibitor group versus 17.5% of the histamine-2 receptor blocker group (risk ratio, 1.05; 95% CI, 1.00 to 1.10; P=.054). The trial report states that study interpretation may be limited by crossover in the use of the assigned medication: an estimated 4.1% of patients randomized to proton pump inhibitors received histamine-2 receptor blockers, and an estimated 20.1% of patients randomized to histamine-2 receptor blockers received proton pump inhibitors. The other statements match Cook 1998, SUP-ICU, and REVISE.",
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
          "text": "Clinically important upper gastrointestinal bleeding occurred in 1.0% with pantoprazole versus 3.5% with placebo (hazard ratio, 0.30; P<0.001), and death at 90 days occurred in 29.1% versus 30.9% (hazard ratio, 0.94; P=0.25)."
        },
        {
          "id": "b",
          "text": "Clinically important gastrointestinal bleeding occurred in 2.5% with pantoprazole versus 4.2% with placebo, and death by 90 days occurred in 31.1% versus 30.4% (relative risk, 1.02; P=0.76)."
        },
        {
          "id": "c",
          "text": "Ventilator-associated pneumonia occurred in 19.1 percent with ranitidine versus 16.2 percent with sucralfate (relative risk, 1.18; P=0.19)."
        },
        {
          "id": "d",
          "text": "Clinically important upper gastrointestinal bleeding occurred in 1.3% with a proton pump inhibitor strategy versus 1.8% with a histamine-2 receptor blocker strategy (risk ratio, 0.73; P=.009)."
        }
      ],
      "correctId": "a",
      "explanation": "REVISE reported clinically important upper gastrointestinal bleeding in 25 of 2385 patients (1.0%) receiving pantoprazole versus 84 of 2377 patients (3.5%) receiving placebo (hazard ratio, 0.30; 95% CI, 0.19 to 0.47; P<0.001). Death at 90 days occurred in 696 of 2390 patients (29.1%) versus 734 of 2379 patients (30.9%) (hazard ratio, 0.94; 95% CI, 0.85 to 1.04; P=0.25). The other statements match SUP-ICU, Cook 1998, and PEPTIC.",
      "source": {
        "label": "REVISE PubMed abstract",
        "pmid": "38875111",
        "doi": "10.1056/NEJMoa2404245",
        "note": "Primary efficacy and primary safety results used in this item."
      }
    }
  ]
};
