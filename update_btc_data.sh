#!/bin/bash
# Update Strategy (formerly MicroStrategy) references

# Homepage
sed -i 's/MicroStrategy/Strategy (formerly MicroStrategy)/g' index.html
sed -i 's/528k BTC/714,644 BTC/g' index.html
sed -i 's/528,000 BTC/714,644 BTC/g' index.html

# Metaplanet updates
sed -i 's/1,762 BTC/35,102 BTC/g' index.html

echo "Homepage updated"

# Update reportes page
sed -i 's/528,000 BTC/714,644 BTC/g' reportes/bitcoin-tesoreria-corporativa.html
sed -i 's/MicroStrategy/Strategy (formerly MicroStrategy)/g' reportes/bitcoin-tesoreria-corporativa.html

echo "Reports updated"

# Update articles
for file in articulos/*.html; do
    sed -i 's/528,000/714,644/g' "$file"
    sed -i 's/~528k/~715k/g' "$file"
    # Keep historical "MicroStrategy" in context but update current refs
done

echo "Articles updated"
