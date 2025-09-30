import React, { useState } from 'react';

const LineFilter: React.FC<{ lines: string[]; onFilterChange: (filteredLines: string[]) => void }> = ({ lines, onFilterChange }) => {
    const [selectedLines, setSelectedLines] = useState<string[]>([]);

    const handleLineChange = (line: string) => {
        const updatedLines = selectedLines.includes(line)
            ? selectedLines.filter(selectedLine => selectedLine !== line)
            : [...selectedLines, line];

        setSelectedLines(updatedLines);
        onFilterChange(updatedLines);
    };

    return (
        <div>
            <h3>Filter Lines</h3>
            {lines.map(line => (
                <div key={line}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedLines.includes(line)}
                            onChange={() => handleLineChange(line)}
                        />
                        {line}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default LineFilter;