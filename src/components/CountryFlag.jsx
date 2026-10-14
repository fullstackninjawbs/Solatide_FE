// Country flag image. The Australian flag (shown on every page) is self-hosted in /public/flags.
// Other flags are only requested when a visitor opens the currency dropdown or selects another
// country, and come from a version-pinned npm path (never the unpinned GitHub "latest" path).
const PINNED_FLAG_CDN = 'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/';

const CountryFlag = ({ countryCode, alt, style, className }) => {
    if (typeof countryCode !== 'string' || !/^[A-Za-z]{2}$/.test(countryCode)) return null;
    const code = countryCode.toLowerCase();
    // Default alt text when the caller does not pass one (e.g. "AU flag")
    const altText = alt ?? `${code.toUpperCase()} flag`;
    const src = code === 'au' ? '/flags/au.svg' : `${PINNED_FLAG_CDN}${code}.svg`;
    return (
        <img
            src={src}
            alt={altText}
            width={20}
            height={15}
            className={className}
            style={{ display: 'inline-block', width: '1em', height: '1em', verticalAlign: 'middle', ...style }}
        />
    );
};

export default CountryFlag;
