def extract_features_from_files(files: dict):
    """
    Input: dict of file contents (bytes)
    Possible keys: businessPlan, marketResearch, financials
    Output: 6 ML features (ALWAYS same order & length)
    """

    def score_text(content):
        if not content:
            return 0.0
        text = content.decode("utf-8", errors="ignore")
        return min(len(text.split()) / 1000, 10)  # scaled 0–10

    # ---- SAFE ACCESS (no KeyErrors) ----
    bp_score = score_text(files.get("businessPlan"))
    mr_score = score_text(files.get("marketResearch"))
    fin_score = score_text(files.get("financials"))

    # ---- Convert to ML features (same logic as before) ----
    market_risk = mr_score / 10
    competition_risk = mr_score / 12
    innovation_level = bp_score / 10
    team_strength = bp_score / 12
    financial_health = fin_score / 10

    # Default when no team data exists
    team_experience = 0.5

    return [
        team_experience,
        market_risk,  # Market Potential
        financial_health, # Financial Stability
        competition_risk, # Competition Level
        innovation_level, # Product Readiness
        innovation_level  # Innovation Level (Placeholder duplicate for now as there's 6 labels)
    ]
