import React from 'react';
import { useState, useEffect, useCallback } from 'react';

interface Todo {
  id: string;
  activity: string;
  price: number;
  type: string;
  bookingRequired: boolean;
  accessibility: number;
}

