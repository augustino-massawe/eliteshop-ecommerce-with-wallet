import os
import random
import subprocess
from datetime import datetime, timedelta

# Target the start of 2025
start_date = datetime(2025, 1, 1)
end_date = datetime(2025, 2, 28)

current_date = start_date

while current_date <= end_date:
    formatted_date = current_date.strftime('%Y-%m-%dT12:00:00')
    
    # Randomly between 35 and 55 commits to match your high-intensity profile
    commits_this_day = random.randint(35, 55)
    
    print(f"Completing {current_date.strftime('%B %d, 2025')}: Adding {commits_this_day} commits...")
    
    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = formatted_date
    env["GIT_COMMITTER_DATE"] = formatted_date
    env["GIT_AUTHOR_NAME"] = "Augustino Massawe"
    env["GIT_AUTHOR_EMAIL"] = "augustinomassawe87@gmail.com"
    env["GIT_COMMITTER_NAME"] = "Augustino Massawe"
    env["GIT_COMMITTER_EMAIL"] = "augustinomassawe87@gmail.com"

    for i in range(commits_this_day):
        subprocess.run(
            ['git', 'commit', '--allow-empty', '-m', f'Initial architecture phase: {current_date.strftime("%b %d")} - commit {i}', '--quiet'],
            env=env
        )
    
    current_date += timedelta(days=1)

print("\n--- 2025 STARTING MONTHS FINISHED ---")
print("Run: git push origin main")