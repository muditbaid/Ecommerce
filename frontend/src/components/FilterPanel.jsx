import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Radio,
  RadioGroup,
  Button,
  Divider,
  styled,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { setFilters, clearFilters, setSortBy } from '../store/slices/productSlice';

const FilterAccordion = styled(Accordion)(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
  boxShadow: 'none',
  borderRadius: 0,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const priceRanges = [
  { min: 0, max: 500 },
  { min: 501, max: 1000 },
  { min: 1001, max: 2000 },
  { min: 2001, max: 3000 },
  { min: 3001, max: null },
];

const fabricOptions = [
  'Cotton',
  'Silk',
  'Chiffon',
  'Georgette',
  'Crepe',
  'Rayon',
  'Linen',
];

const styleOptions = [
  'A-line',
  'Straight',
  'Anarkali',
  'Asymmetric',
  'High-Low',
  'Trail Cut',
];

const occasionOptions = [
  'Casual',
  'Party',
  'Festival',
  'Wedding',
  'Office',
  'Daily Wear',
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' },
];

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { filters, sortBy } = useSelector((state) => state.product);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handlePriceRangeChange = (range) => {
    dispatch(
      setFilters({
        minPrice: range.min,
        maxPrice: range.max === null ? Number.MAX_SAFE_INTEGER : range.max,
      })
    );
  };

  const handleSortChange = (event) => {
    dispatch(setSortBy(event.target.value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 280 }}>
      {/* Sort By Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Sort By
        </Typography>
        <RadioGroup value={sortBy} onChange={handleSortChange}>
          {sortOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size="small" />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <FilterAccordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {priceRanges.map((range, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    size="small"
                    checked={
                      filters.minPrice === range.min &&
                      filters.maxPrice === (range.max || Number.MAX_SAFE_INTEGER)
                    }
                    onChange={() => handlePriceRangeChange(range)}
                  />
                }
                label={
                  range.max
                    ? `₹${range.min} - ₹${range.max}`
                    : `₹${range.min} & Above`
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </FilterAccordion>

      {/* Fabric */}
      <FilterAccordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Fabric
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {fabricOptions.map((fabric) => (
              <FormControlLabel
                key={fabric}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.fabric === fabric}
                    onChange={() => handleFilterChange('fabric', fabric)}
                  />
                }
                label={fabric}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </FilterAccordion>

      {/* Style */}
      <FilterAccordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Style
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {styleOptions.map((style) => (
              <FormControlLabel
                key={style}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.style === style}
                    onChange={() => handleFilterChange('style', style)}
                  />
                }
                label={style}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </FilterAccordion>

      {/* Occasion */}
      <FilterAccordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Occasion
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {occasionOptions.map((occasion) => (
              <FormControlLabel
                key={occasion}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.occasion === occasion}
                    onChange={() => handleFilterChange('occasion', occasion)}
                  />
                }
                label={occasion}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </FilterAccordion>

      {/* Clear Filters Button */}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleClearFilters}
        >
          Clear All Filters
        </Button>
      </Box>
    </Box>
  );
};

export default FilterPanel; 