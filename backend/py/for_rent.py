#!/usr/bin/env python
"""
CLI wrapper for HomeHarvest v0.2.18  (supports Zillow, Realtor.com, Redfin)

Examples
--------
# 200 Canadian rentals from Zillow
python for_rent.py "Toronto, ON" --site_name zillow --limit 200

# Combine two sites and keep duplicates
python for_rent.py "Vancouver, BC" --site_name zillow redfin --limit 500 --keep_duplicates
"""
from __future__ import annotations

import argparse
import json
import sys
import traceback
from typing import List, Optional

import pandas as pd
from homeharvest import scrape_property
from homeharvest.exceptions import (
    InvalidSite,
    InvalidListingType,
    NoResultsFound,
)

# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def fetch_rentals(
    location: str,
    site_list: List[str],
    limit: int,
    keep_duplicates: bool,
    proxy: Optional[str] = None,
) -> pd.DataFrame:
    """
    Call HomeHarvest and post-process the DataFrame.

    Parameters
    ----------
    location : str              – "Toronto, ON"
    site_list : list[str]       – ["zillow", "redfin"]
    limit : int                 – truncate results to N rows
    keep_duplicates : bool      – forward to HH
    proxy : str | None          – optional proxy URL
    """
    df: pd.DataFrame = scrape_property(
        site_name=site_list,
        location=location,
        listing_type="for_rent",
        keep_duplicates=keep_duplicates,
        proxy=proxy,
    )

    # head() if user asked for a hard limit
    if limit and len(df) > limit:
        df = df.head(limit)

    return df


def to_json(df: pd.DataFrame) -> str:
    """DataFrame → JSON string, Datetime safe"""
    return json.dumps(
        df.to_dict(orient="records"),
        default=str,     # pandas Timestamp → ISO string
        ensure_ascii=False,
    )


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #
def main() -> None:
    p = argparse.ArgumentParser(
        description="Scrape for-rent properties with HomeHarvest v0.2.18"
    )
    p.add_argument("location", help='e.g. "Toronto, ON" or "M5V 2T6"')
    p.add_argument(
        "--site_name",
        nargs="+",
        default=["zillow"],
        metavar="SITE",
        choices=["zillow", "realtor.com", "redfin"],
        help="One or more sites (default: zillow)",
    )
    p.add_argument(
        "--limit",
        type=int,
        default=1000,
        help="Maximum number of rows to return (default 1000)",
    )
    p.add_argument(
        "--keep_duplicates",
        action="store_true",
        help="Keep duplicate addresses (default: drop dups)",
    )
    p.add_argument(
        "--proxy",
        type=str,
        default=None,
        help="Proxy URL (http[s]/socks), e.g. http://user:pass@host:port",
    )
    args = p.parse_args()

    try:
        df = fetch_rentals(
            location=args.location,
            site_list=args.site_name,
            limit=args.limit,
            keep_duplicates=args.keep_duplicates,
            proxy=args.proxy,
        )
        if df.empty:
            raise NoResultsFound("HomeHarvest returned 0 rows.")

        print(to_json(df))

    except (InvalidSite, InvalidListingType, NoResultsFound) as e:
        # expected library exceptions → exit 2
        sys.stderr.write(f"{type(e).__name__}: {e}\n")
        sys.exit(2)
    except Exception as e:  # catch-all → exit 1
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
