import requests
import json
import sys
import subprocess
import re


prod_api = 'https://nomad-lab.eu/prod/v1/api/'
prod_files = '/nomad/fairdi/prod/fs/public'

response = requests.post(
    f'{prod_api}v1/entries/query',
    json={
        'owner': 'visible',
        'query': {},
        'pagination': {
            'page_size': 0
        },
        'aggregations': {
            'materials': {
                'statistics': {
                    'metrics': [
                        'n_materials',
                    ]
                }
            }
        }
    })

if response.status_code != 200:
    sys.exit('Cannot request entries and materials')

data = response.json()
entries = data['pagination']['total']
materials = data['aggregations']['materials']['statistics']['data']['n_materials']

result = subprocess.run(['du', '-sh', prod_files], stdout=subprocess.PIPE)
if result.returncode != 0:
    sys.exit('Could not run raw du command.')

match = re.search(r'([0-9,\.]+)(K|M|T|G)', result.stdout.decode())
if not match or not len(match.groups()) == 2:
    sys.exit('Could not match raw du command.')

raw = f'{match.group(1)} {match.group(2)}B'


with open(sys.argv[1], 'wt') as f:
    json.dump({
        'entries': f'{entries:,}',
        'materials': f'{materials:,}',
        'rawFiles': raw
    }, f)
