INSERT INTO scraped_content (title, summary, source_url, captured_at, tags, raw_text)
VALUES
  (
    'AI Research Breakthrough',
    'Researchers unveil a new transformer variant that improves efficiency by 30%.',
    'https://example.com/ai-breakthrough',
    NOW() - INTERVAL '1 day',
    ARRAY['AI', 'Research', 'Transformers'],
    'Full article text about the new transformer architecture and benchmarks.'
  ),
  (
    'E-commerce Trends 2024',
    'An in-depth look at consumer behavior shifts heading into 2024.',
    'https://example.com/ecommerce-trends',
    NOW() - INTERVAL '3 days',
    ARRAY['E-commerce', 'Report'],
    'Detailed insights into market segments and predictions for the upcoming year.'
  ),
  (
    'Climate Policy Update',
    'New regulations aim to cut carbon emissions by 15% over the next five years.',
    'https://example.com/climate-policy',
    NOW() - INTERVAL '5 hours',
    ARRAY['Climate', 'Policy', 'Environment'],
    'Summary of legislative changes and expert commentary on implementation.'
  ),
  (
    'Tech Funding Roundup',
    'Startups raise over $500M across fintech, healthtech, and edtech sectors.',
    'https://example.com/funding-roundup',
    NOW() - INTERVAL '12 hours',
    ARRAY['Funding', 'Startups', 'Finance'],
    'Comprehensive list of funding rounds with investor details and company highlights.'
  );

INSERT INTO urls (url, active)
VALUES
  ('https://example.com/ai-breakthrough', TRUE),
  ('https://example.com/ecommerce-trends', TRUE),
  ('https://example.com/climate-policy', TRUE),
  ('https://example.com/funding-roundup', FALSE);
