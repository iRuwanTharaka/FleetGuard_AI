/**
 * @module     Testing Related
 * @author     Iruwan Tharaka <iruwantharaka2001@gmail.com>
 * @description This file is part of the test suite of FleetGuard AI.
 *              Developed and maintained by Iruwan Tharaka.
 * @date       2026-02-18
 */

import { describe, it, expect } from 'vitest';
import { healthColor, healthLabel, healthFromDamages } from './healthScore';

describe('healthScore utils', () => {
  describe('healthColor', () => {
    it('returns green hex for score >= 80', () => {
      expect(healthColor(80)).toBe('#70AD47');
      expect(healthColor(100)).toBe('#70AD47');
    });

    it('returns yellow hex for score 60-79', () => {
      expect(healthColor(60)).toBe('#FFC000');
      expect(healthColor(79)).toBe('#FFC000');
    });

    it('returns red hex for score < 60', () => {
      expect(healthColor(0)).toBe('#C00000');
      expect(healthColor(59)).toBe('#C00000');
    });
  });

  describe('healthLabel', () => {
    it('returns Good for score >= 80', () => {
      expect(healthLabel(80)).toBe('Good');
      expect(healthLabel(100)).toBe('Good');
    });
    it('returns Fair for score 60-79', () => {
      expect(healthLabel(60)).toBe('Fair');
      expect(healthLabel(79)).toBe('Fair');
    });
    it('returns Poor for score < 60', () => {
      expect(healthLabel(0)).toBe('Poor');
      expect(healthLabel(59)).toBe('Poor');
    });
  });

  describe('healthFromDamages', () => {
    it('calculates health from damages', () => {
      expect(healthFromDamages([])).toBe(100);
      expect(healthFromDamages([{ severity: 'low' }])).toBe(95);
      expect(healthFromDamages([{ severity: 'high' }])).toBe(70);
    });
  });
});
