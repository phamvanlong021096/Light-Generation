package com.lightgeneration.kid_locker.fragments.graphs;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.lightgeneration.kid_locker.R;
import com.lightgeneration.kid_locker.fragments.BaseFragment;

/**
 * Created by Ngoc Sang on 3/11/2017.
 */

public class GraphFragment extends BaseFragment{
    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        contentView=inflater.inflate(R.layout.graph_fragment,container,false);
        return contentView;
    }
}
